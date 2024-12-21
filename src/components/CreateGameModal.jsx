import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useGameApi from '@/hooks/useGameApi';
import useDrawApi from '@/hooks/useDrawApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@/helpers/handleError';
import { LOTTERY_TYPE } from '@/consts/Enums';
import { useAuth } from '@/hooks/useAuth';
import BettingSlip from './BettingSlip';
import LoadingLabel from './LoadingLabel';
import useToastAlert from '@/hooks/useToastAlert';

const newGameDataInitialState = {
  gameNumbers: '',
  ticketPrice: 0,
  contestNumber: 0,
  drawDate: '',
  lotteryType: '',
};

const parseHTML = (htmlString) => {
  // Create a new DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Extract game numbers
  const extractNumbers = (label) =>
    Array.from(doc.querySelectorAll('h2'))
      .find((h) => h.textContent?.includes(label))
      ?.textContent?.match(/\d+/g) || [];

  const gameA = extractNumbers('Aposta A');
  const gameB = extractNumbers('Aposta B');
  const gameC = extractNumbers('Aposta C');

  // Extract ticket price
  const totalCell = Array.from(doc.querySelectorAll('td')).find((td) =>
    td.textContent.includes('TOTAL:')
  );
  const ticketPriceText = totalCell ? totalCell.textContent : '0';
  const ticketPrice = parseFloat(
    ticketPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')
  );

  // Extract contest number and draw date
  let contestNumber = null;
  doc.querySelectorAll('h2').forEach((h) => {
    const match = h.textContent.match(/CONCURSO (\d+)/);
    if (match) contestNumber = parseInt(match[1], 10);
  });

  // Create the final object
  return {
    gameNumbers: { gameA, gameB, gameC },
    ticketPrice,
    contestNumber,
    lotteryType: 'MEGA_SENA',
  };
};

const CreateGameModal = () => {
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newGameData, setNewGameData] = useState(newGameDataInitialState);
  const [action, setAction] = useState(null);
  const { toastAlert } = useToastAlert();

  const { addGame } = useGameApi();
  const queryClient = useQueryClient();

  const createGameMutation = useMutation({
    mutationFn: (gameData) => addGame(auth.user.id, gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      handleCancelButtonClick();
      toastAlert({
        type: 'success',
        title: 'Jogo cadastrado!',
        message: 'Jogo salvo no banco de dados com sucesso!',
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao cadastrar jogo!',
        message: error,
      });
    },
  });

  const { fetchDrawResult } = useDrawApi();
  const contestData = useQuery({
    queryKey: ['contestData', newGameData.lotteryType, newGameData.contestNumber],
    queryFn: () =>
      fetchDrawResult(
        newGameData.lotteryType.replace('_', '').toLowerCase(),
        newGameData.contestNumber,
        { prevContest: true }
      ),
    enabled: Boolean(
      newGameData.lotteryType && String(newGameData.contestNumber).length === 4
    ),
  });

  useEffect(() => {
    if (contestData.isFetching) {
      setNewGameData((prev) => ({ ...prev, drawDate: 'Buscando...' }));
    }

    if (contestData.isSuccess) {
      if (contestData.data.code === 'ERR_NETWORK') {
        toastAlert({
          type: 'danger',
          title: 'Erro de rede',
          message:
            'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
        });
      }

      setNewGameData((prev) => ({
        ...prev,
        drawDate:
          contestData.data?.response?.status === 500
            ? 'Indefinida'
            : contestData.data?.dataProximoConcurso,
      }));
    }

    if (contestData.isError) {
      setNewGameData((prev) => ({
        ...prev,
        drawDate: 'Erro: Tente novamente',
      }));
    }
  }, [contestData.isFetching]);

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];

    const newValue = name === 'contestNumber' ? Number(value) : value;

    setNewGameData((prevData) => ({
      ...prevData,
      drawDate: '',
      [name]: newValue,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlString = e.target.result;
        const parsedData = parseHTML(htmlString);
        setNewGameData((prev) => ({
          ...prev,
          ...parsedData,
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleSaveButtonClick = () => {
    createGameMutation.mutate(newGameData);
  };

  const handleCancelButtonClick = () => {
    setModalOpen(false);
    setAction(null);
    setNewGameData(newGameDataInitialState);
  };

  const handleActions = (actionType) => {
    setAction(actionType);
  };

  const resetAction = () => {
    setAction(null);
  };

  const canSave = [...Object.values(newGameData)].every(Boolean);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleCancelButtonClick}>
          <HiOutlinePlusCircle size={20} className="me-1" />
          Novo jogo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo jogo</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>
              Insira abaixo os dados do novo jogo ou importe um comprovante ao lado:
            </span>
            <Input
              id="file"
              type="file"
              name="file"
              onChange={handleFileChange}
              className="w-full"
            />
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-between">
            <div className="flex justify-between gap-3">
              <div className="grid items-center gap-1">
                <Label htmlFor="lotteryType" className="text-left">
                  Loteria
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {newGameData.lotteryType
                        ? LOTTERY_TYPE.find(
                            (lotteryType) => lotteryType.value === newGameData.lotteryType
                          )?.label
                        : 'Selecione a loteria...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Pesquisar loteria..." />
                      <CommandList>
                        <CommandEmpty>Loteria não encontrada.</CommandEmpty>
                        <CommandGroup>
                          {LOTTERY_TYPE.map((lotteryType) => (
                            <CommandItem
                              key={lotteryType.value}
                              value={lotteryType.value}
                              onSelect={(currentValue) => {
                                const selectedLotteryType =
                                  currentValue === newGameData.lotteryType
                                    ? ''
                                    : currentValue;
                                setNewGameData((prevData) => ({
                                  ...prevData,
                                  drawDate: '',
                                  lotteryType: selectedLotteryType,
                                }));
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  newGameData.lotteryType === lotteryType.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {lotteryType.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid items-center gap-1">
                <Label htmlFor="contestNumber" className="text-left">
                  Concurso
                </Label>
                <Input
                  id="contestNumber"
                  name="contestNumber"
                  className="w-20"
                  maxLength={4}
                  size={4}
                  onChange={handleInputChange}
                  value={newGameData.contestNumber || ''}
                />
              </div>

              <div className="grid items-center gap-1">
                <Label htmlFor="drawDate" className="text-left">
                  Data do sorteio
                </Label>
                <Input
                  id="drawDate"
                  name="drawDate"
                  className={`${
                    newGameData?.drawDate === 'Indefinida'
                      ? 'text-red-600 font-semibold'
                      : null
                  } cursor-not-allowed`}
                  value={newGameData.drawDate}
                  size={8}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="gap-1">
            <BettingSlip
              setNewGameData={setNewGameData}
              importedGameNumbers={newGameData?.gameNumbers}
              action={action}
              resetAction={resetAction}
            />
          </div>
        </div>

        <DialogFooter className="!justify-between">
          <div className="flex gap-3">
            <Button
              onClick={() => handleActions('onConfirm')}
              className="bg-green-500 hover:bg-green-400 text-black"
            >
              Confirmar
            </Button>
            <Button
              onClick={() => handleActions('onClear')}
              className="bg-yellow-500 hover:bg-yellow-400 text-black"
            >
              Limpar
            </Button>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => handleActions('onExclude')} variant="destructive">
              Excluir tudo
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelButtonClick}
                tabIndex={-1}
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={!canSave || createGameMutation.isPending}
              onClick={handleSaveButtonClick}
            >
              {createGameMutation.isPending ? (
                <LoadingLabel label={'Salvando'} />
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
