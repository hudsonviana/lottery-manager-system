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
} from '@/components/ui/dialog';
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
// import useDrawApi from '@/hooks/useDrawApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@/helpers/handleError';
import { toast } from '@/hooks/use-toast';
import { LOTTERY_TYPE } from '@/consts/Enums';
import { useAuth } from '@/hooks/useAuth';
import BettingSlip from './BettingSlip';
import LoadingLabel from './LoadingLabel';

const UpdateGameModal = ({ game, isUpdateModalOpen, setIsUpdateModalOpen }) => {
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [updateGameData, setUpdateGameData] = useState({});
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (isUpdateModalOpen) {
      setUpdateGameData(game);
    } else {
      setUpdateGameData({});
    }
  }, [isUpdateModalOpen]);

  const { updateGame } = useGameApi();
  const queryClient = useQueryClient();

  const updateGameMutation = useMutation({
    mutationFn: ({ playerId, id, gameData }) => updateGame(playerId, id, gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      handleCancelButtonClick();
      toast({
        className: 'bg-green-200 text-green-800 border-green-300',
        title: 'Jogo atualizado!',
        description: `Jogo atualizado no banco de dados com sucesso!.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toast({
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Erro ao atualizar jogo!',
        description: error.map((err, i) => <p key={i}>{err}</p>),
      });
    },
  });

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];

    const newValue = name === 'contestNumber' ? Number(value) : value;

    setUpdateGameData((prevData) => ({
      ...prevData,
      drawDate: '',
      [name]: newValue,
    }));
  };

  const handleUpdateButtonClick = () => {
    updateGameMutation.mutate({
      playerId: auth.user.id,
      id: updateGameData.id,
      gameData: updateGameData,
    });
  };

  const handleCancelButtonClick = () => {
    setIsUpdateModalOpen(false);
    setAction(null);
    setUpdateGameData({});
  };

  const handleActions = (actionType) => {
    setAction(actionType);
  };

  const resetAction = () => {
    setAction(null);
  };

  const canSave = [...Object.values(updateGameData)].every(Boolean);

  return (
    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Atualizar jogo</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Modifique abaixo os dados do jogo a ser atualizado:</span>
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
                      className="w-[200px] justify-between cursor-not-allowed"
                      disabled={true}
                    >
                      {updateGameData.lotteryType
                        ? LOTTERY_TYPE.find(
                            (lotteryType) =>
                              lotteryType.value === updateGameData.lotteryType
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
                                  currentValue === updateGameData.lotteryType
                                    ? ''
                                    : currentValue;
                                setUpdateGameData((prevData) => ({
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
                                  updateGameData.lotteryType === lotteryType.value
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
                  value={updateGameData.contestNumber || ''}
                  disabled={true}
                />
              </div>

              <div className="grid items-center gap-1">
                <Label htmlFor="drawDate" className="text-left">
                  Data do sorteio
                </Label>
                <Input
                  id="drawDate"
                  name="drawDate"
                  value={updateGameData.drawDate}
                  size={8}
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="gap-1">
            <BettingSlip
              setNewGameData={setUpdateGameData}
              importedGameNumbers={updateGameData?.gameNumbers}
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
              disabled={!canSave || updateGameMutation.isPending}
              onClick={handleUpdateButtonClick}
            >
              {updateGameMutation.isPending ? (
                <LoadingLabel label={'Atualizando'} />
              ) : (
                'Atualizar'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGameModal;
