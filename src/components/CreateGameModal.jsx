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

const CreateGameModal = () => {
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newGameData, setNewGameData] = useState({
    gameNumbers: '',
    ticketPrice: '',
    contestNumber: '',
    drawDate: '',
    lotteryType: '',
  });

  /**
   * const addGameSchema = z.object({
    gameNumbers: gameNumbersSchema,
    ticketPrice: z.number().nonnegative().optional(),
    contestNumber: z.number().positive(),
    drawDate: z.string().refine(validateDateFormat, { message: 'Formato de data inválido' }),
    lotteryType: z.enum(['MEGA_SENA', 'QUINA', 'LOTOFACIL', 'TIMEMANIA', 'LOTOMANIA']),
  });
  */

  const { addGame } = useGameApi();
  const { fetchDrawResult } = useDrawApi();

  const queryClient = useQueryClient();

  const createGameMutation = useMutation({
    mutationFn: (gameData) => addGame(auth.user.id, gameData),
    onSuccess: ({ newGame }) => {
      queryClient.invalidateQueries({ queryKey: ['games', auth.user.id] });
      handleCancelButtonClick();
      toast({
        className: 'bg-green-200 text-green-800 border-green-300',
        title: 'Jogo cadastrado!',
        description: `O jogo referente ao Concurso: ${newGame.draw.contestNumber}) foi criado no banco de dados.`,
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

  const contestData = useQuery({
    queryKey: [
      'contestData',
      newGameData.lotteryType,
      newGameData.contestNumber,
    ],
    queryFn: () =>
      fetchDrawResult(
        newGameData.lotteryType.replace('_', '').toLowerCase(),
        newGameData.contestNumber
      ),
    enabled: Boolean(
      newGameData.lotteryType && newGameData.contestNumber.length === 4
    ),
  });

  useEffect(() => {
    if (contestData?.isFetching) {
      setNewGameData((prevData) => ({
        ...prevData,
        drawDate: 'Buscando...',
      }));
    }

    if (contestData?.isSuccess) {
      if (contestData?.data?.status === 500) {
        setNewGameData((prevData) => ({
          ...prevData,
          drawDate: 'Data indefinida',
        }));
      } else {
        setNewGameData((prevData) => ({
          ...prevData,
          drawDate: contestData?.data?.dataApuracao,
        }));
      }
    }
  }, [contestData?.isSuccess, contestData?.data?.dataApuracao]); //

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];
    setNewGameData((prevData) => ({
      ...prevData,
      drawDate: '',
      [name]: value,
    }));
  };

  const handleSaveButtonClick = () => {
    createGameMutation.mutate(newGameData);
  };

  const handleCancelButtonClick = () => {
    setModalOpen(false);
    setNewGameData({
      gameNumbers: '',
      ticketPrice: '',
      contestNumber: '',
      drawDate: '',
      lotteryType: '',
    });
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
      <DialogContent className="sm:max-w-[600px]">
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
                className=""
                disabled={true}
                value={newGameData.drawDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Sobrenome
            </Label>
            <Input
              id="lastName"
              name="lastName"
              className="col-span-3"
              onChange={handleInputChange}
              // value={newGameData.lastName}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              className="col-span-3"
              onChange={handleInputChange}
              // value={newGameData.email}
            />
          </div>
        </div>

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
