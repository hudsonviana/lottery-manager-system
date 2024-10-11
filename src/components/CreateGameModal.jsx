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
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useGameApi from '@/hooks/useGameApi';
import useDrawApi from '@/hooks/useDrawApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@/helpers/handleError';
import { toast } from '@/hooks/use-toast';
import { LOTTERY_TYPE } from '@/consts/Enums';
import { useAuth } from '@/hooks/useAuth';
import BettingSlip from './BettingSlip';

const newGameDataInitialState = {
  gameNumbers: '',
  ticketPrice: 0,
  contestNumber: 0,
  drawDate: '',
  lotteryType: '',
};

const CreateGameModal = () => {
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newGameData, setNewGameData] = useState(newGameDataInitialState);
  const [action, setAction] = useState(null);

  const { addGame } = useGameApi();
  const queryClient = useQueryClient();

  const createGameMutation = useMutation({
    mutationFn: (gameData) => addGame(auth.user.id, gameData),
    onSuccess: ({ newGame }) => {
      queryClient.invalidateQueries({ queryKey: ['games', auth.user.id] });
      console.log('newGame:', newGame);
      handleCancelButtonClick();
      toast({
        className: 'bg-green-200 text-green-800 border-green-300',
        title: 'Jogo cadastrado!',
        description: `Jogo criado no banco de dados com sucesso!.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toast({
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Erro ao criar jogo!',
        description: error.map((err, i) => <p key={i}>{err}</p>),
      });
    },
  });

  const { fetchDrawResult } = useDrawApi();
  const contestData = useQuery({
    queryKey: [
      'contestData',
      newGameData.lotteryType,
      newGameData.contestNumber,
    ],
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
      setNewGameData((prev) => ({
        ...prev,
        drawDate:
          contestData.data?.status === 500
            ? 'Data indefinida'
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
          <DialogDescription>Insira os dados do novo jogo.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-between">
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
                          (lotteryType) =>
                            lotteryType.value === newGameData.lotteryType
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
                onChange={handleInputChange}
                // value={newGameData.contestNumber}
              />
            </div>

            <div className="grid items-center gap-1">
              <Label htmlFor="drawDate" className="text-left">
                Data do sorteio
              </Label>
              <Input
                id="drawDate"
                name="drawDate"
                className="cursor-not-allowed"
                value={newGameData.drawDate}
                readOnly
              />
            </div>
          </div>

          <div className="gap-1">
            <BettingSlip
              setNewGameData={setNewGameData}
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
            <Button
              onClick={() => handleActions('onExclude')}
              variant="destructive"
            >
              Excluir
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde
                </>
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
