import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { handleError } from '@/helpers/handleError';
import LoadingLabel from './LoadingLabel';
import useToastAlert from '@/hooks/useToastAlert';
import useGroupApi from '@/hooks/useGroupApi';

const UpdateGroupModal = ({ group, isUpdateModalOpen, setIsUpdateModalOpen }) => {
  const [groupUpdateData, setGroupUpdateData] = useState({});
  const { toastAlert, dismiss } = useToastAlert();

  useEffect(() => {
    setGroupUpdateData(group);
  }, [isUpdateModalOpen]);

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];
    setGroupUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRadioClick = (e) => {
    if (e.target.value)
      setGroupUpdateData((prevData) => ({
        ...prevData,
        isPool: e.target.value === 'true',
      }));
  };

  const { updateGroup } = useGroupApi();
  const queryClient = useQueryClient();

  const updateGroupMutation = useMutation({
    mutationFn: (groupData) => updateGroup(group.id, groupData),
    onSuccess: ({ updatedGroup }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      handleCancelButtonClick();
      toastAlert({
        type: 'success',
        title: 'Grupo atualizado!',
        message: `O grupo: "${updatedGroup.name}" foi atualizado no banco de dados com sucesso!`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao atualizar grupo!',
        message: error,
      });
    },
  });

  const handleUpdateButtonClick = () => {
    updateGroupMutation.mutate(groupUpdateData);
  };

  const handleCancelButtonClick = () => {
    setIsUpdateModalOpen(false);
    setGroupUpdateData({});
    dismiss();
  };

  const { isPool, ...dataWithoutIsPool } = groupUpdateData;
  const canSave = [...Object.values(dataWithoutIsPool)].every(Boolean);

  return (
    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar grupo</DialogTitle>
          <DialogDescription>
            Insira os dados do grupo que deseja atualizar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              onChange={handleInputChange}
              value={groupUpdateData.name}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              name="description"
              onChange={handleInputChange}
              value={groupUpdateData.description}
              maxLength={250}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isPool" className="text-right">
              É bolão?
            </Label>

            <RadioGroup value={groupUpdateData.isPool ? 'true' : 'false'}>
              <div className="flex flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="rd1" onClick={handleRadioClick} />
                  <Label htmlFor="rd1">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="rd2" onClick={handleRadioClick} />
                  <Label htmlFor="rd2">Não</Label>
                </div>
              </div>
            </RadioGroup>
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
            disabled={!canSave || updateGroupMutation.isPending}
            onClick={handleUpdateButtonClick}
          >
            {updateGroupMutation.isPending ? (
              <LoadingLabel label={'Salvando'} />
            ) : (
              'Salvar modificações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroupModal;
