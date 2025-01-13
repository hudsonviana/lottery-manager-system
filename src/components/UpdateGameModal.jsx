import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LOTTERY_TYPE } from '@/consts/Enums';
import LoadingLabel from './LoadingLabel';
import BettingSlip from './BettingSlip';
import SelectInput from './SelectInput';
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
import { useAuth } from '@/hooks/useAuth';
import useGameApi from '@/hooks/useGameApi';
import useToastAlert from '@/hooks/useToastAlert';
import { handleError } from '@/helpers/handleError';

const UpdateGameModal = ({
  game,
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  groupOptions,
}) => {
  const { auth } = useAuth();
  const [updateGameData, setUpdateGameData] = useState(game);
  const [action, setAction] = useState(null);
  const { toastAlert } = useToastAlert();

  const { updateGame } = useGameApi();
  const queryClient = useQueryClient();

  const updateGameMutation = useMutation({
    mutationFn: ({ playerId, id, gameData }) => updateGame(playerId, id, gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      handleCancelButtonClick();
      toastAlert({
        type: 'success',
        title: 'Jogo atualizado!',
        message: 'Jogo atualizado no banco de dados com sucesso!',
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao atualizar jogo!',
        message: error,
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateGameData((prevData) => ({
      ...prevData,
      [name]: name === 'contestNumber' ? Number(value) : value,
    }));
  };

  const handleLotteryChange = (selectedLottery) => {
    setUpdateGameData((prevData) => ({
      ...prevData,
      lotteryType: selectedLottery,
    }));
  };

  const handleGroupChange = (selectedGroup) => {
    setUpdateGameData((prevData) => ({
      ...prevData,
      groupId: selectedGroup,
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
    setUpdateGameData(game);
  };

  const handleActions = (actionType) => {
    setAction(actionType);
  };

  const resetAction = () => {
    setAction(null);
  };

  const { groupId, ...restGameData } = updateGameData;
  const canSave = Object.values(restGameData).every(Boolean);

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
            <div className="flex justify-between gap-3 w-full">
              <div className="grid items-center gap-1">
                <Label htmlFor="lotteryType" className="text-left">
                  Loteria
                </Label>

                <SelectInput
                  options={LOTTERY_TYPE}
                  value={updateGameData.lotteryType}
                  onChange={handleLotteryChange}
                  placeholder="Selecione a loteria..."
                  searchPlaceholder="Pesquisar loteria..."
                  emptyMessage="Loteria não encontrada"
                  disabled={true}
                />
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

              <div className="grid items-center gap-1">
                <Label htmlFor="lotteryType" className="text-left">
                  Grupo (opcional)
                </Label>
                <SelectInput
                  options={groupOptions}
                  value={updateGameData.groupId}
                  onChange={handleGroupChange}
                  placeholder="Selecione o grupo..."
                  searchPlaceholder="Pesquisar grupo..."
                  emptyMessage="Grupo não encontrado"
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
