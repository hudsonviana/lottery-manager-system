import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER_ROLES } from '@/consts/Enums';
import LoadingLabel from './LoadingLabel';
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
import useUserApi from '@/hooks/useUserApi';
import useToastAlert from '@/hooks/useToastAlert';
import { handleError } from '@/helpers/handleError';

const UpdateUserModal = ({
  user,
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  isOwnUser = false,
}) => {
  const [userUpdateData, setUserUpdateData] = useState({});
  const { toastAlert } = useToastAlert();

  useEffect(() => {
    setUserUpdateData(user);
  }, [isUpdateModalOpen]);

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];
    setUserUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoleChange = (selectedRole) => {
    setUserUpdateData((prevData) => ({
      ...prevData,
      role: selectedRole,
    }));
  };

  const { updateUser } = useUserApi();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: (userData) => updateUser(user.id, userData),
    onSuccess: ({ updatedUser }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCancelButtonClick();
      toastAlert({
        type: 'success',
        title: 'Usuário atulizado!',
        message: `O usuário: ${updatedUser.firstName} ${updatedUser.lastName} (Email: ${updatedUser.email}) foi atualizado no banco de dados com sucesso!`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao atualizar usuário!',
        message: error,
      });
    },
  });

  const handleUpdateButtonClick = () => {
    updateUserMutation.mutate(userUpdateData);
  };

  const handleCancelButtonClick = () => {
    setIsUpdateModalOpen(false);
    setUserUpdateData({});
  };

  const canSave = [...Object.values(userUpdateData)].every(Boolean);

  return (
    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar usuário</DialogTitle>
          <DialogDescription>
            Insira os dados do usuário que deseja atualizar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Nome
            </Label>
            <Input
              id="firstName"
              name="firstName"
              className="col-span-3"
              value={userUpdateData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Sobrenome
            </Label>
            <Input
              id="lastName"
              name="lastName"
              className="col-span-3"
              value={userUpdateData.lastName}
              onChange={handleInputChange}
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
              value={userUpdateData.email}
              onChange={handleInputChange}
            />
          </div>

          {!isOwnUser && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Perfil
              </Label>

              <SelectInput
                options={USER_ROLES}
                value={userUpdateData.role}
                onChange={handleRoleChange}
                placeholder="Selecione o perfil..."
                searchPlaceholder="Pesquisar perfil..."
                emptyMessage="Perfil não encontrado."
              />
            </div>
          )}
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
            disabled={!canSave || updateUserMutation.isPending}
            onClick={handleUpdateButtonClick}
          >
            {updateUserMutation.isPending ? (
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

export default UpdateUserModal;
