import { useState } from 'react';
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
import { useMutation } from '@tanstack/react-query';
import useUserApi from '@/hooks/useUserApi';
import { handleError } from '@/helpers/handleError';
import { toast } from '@/hooks/use-toast';

const ChangePasswordModal = ({
  id,
  isChangePassModalOpen,
  setIsChangePassModalOpen,
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const { changePassword } = useUserApi();

  const changePasswordMutation = useMutation({
    mutationFn: (passData) => changePassword(id, passData),
    onSuccess: ({ updatedUserPassword }) => {
      setIsChangePassModalOpen(false);
      handleCancelButtonClick();
      toast({
        className: 'bg-green-200 text-green-800 border-green-300',
        title: 'Senha alterada com sucesso!',
        description: `A senha do usuário: ${updatedUserPassword.firstName} ${updatedUserPassword.lastName} (Email: ${updatedUserPassword.email}) foi atualizada no banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toast({
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Erro ao atualizar a senha!',
        description: error.map((err, i) => <p key={i}>{err}</p>),
      });
    },
  });

  const handleChangePassButtonClick = () => {
    changePasswordMutation.mutate(passwordData);
  };

  const handleCancelButtonClick = () => {
    setIsChangePassModalOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const canSave = [...Object.values(passwordData)].every(Boolean);

  return (
    <Dialog
      open={isChangePassModalOpen}
      onOpenChange={setIsChangePassModalOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar senha</DialogTitle>
          <DialogDescription>
            Forneça a senha atual e a nova senha, confirmando-a em seguida.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentPassword" className="text-right">
              Senha atual
            </Label>
            <Input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              Nova senha
            </Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmNewPassword" className="text-right">
              Confirmar nova senha
            </Label>
            <Input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelButtonClick}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={!canSave}
            onClick={handleChangePassButtonClick}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
