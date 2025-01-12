import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import useUserApi from '@/hooks/useUserApi';
import useToastAlert from '@/hooks/useToastAlert';
import { handleError } from '@/helpers/handleError';
import { HiOutlinePlusCircle } from 'react-icons/hi';

const CreateUserModal = () => {
  const { toastAlert } = useToastAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];
    setNewUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoleChange = (selectedRole) => {
    setNewUserData((prevData) => ({
      ...prevData,
      role: selectedRole,
    }));
  };

  const { addUser } = useUserApi();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: ({ user }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCancelButtonClick();
      toastAlert({
        type: 'success',
        title: 'Usuário cadastrado!',
        message: `O usuário: ${user.firstName} ${user.lastName} (Email: ${user.email}) foi criado no banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao criar usuário!',
        message: error,
      });
    },
  });

  const handleSaveButtonClick = () => {
    createUserMutation.mutate(newUserData);
  };

  const handleCancelButtonClick = () => {
    setModalOpen(false);
    setNewUserData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    });
  };

  const canSave = [...Object.values(newUserData)].every(Boolean);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleCancelButtonClick}>
          <HiOutlinePlusCircle size={20} className="me-1" />
          Novo usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo usuário</DialogTitle>
          <DialogDescription>Insira os dados do novo usuário.</DialogDescription>
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
              onChange={handleInputChange}
              value={newUserData.firstName}
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
              onChange={handleInputChange}
              value={newUserData.lastName}
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
              value={newUserData.email}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Perfil
            </Label>

            <SelectInput
              options={USER_ROLES}
              value={newUserData.role}
              onChange={handleRoleChange}
              placeholder="Selecione o perfil..."
              searchPlaceholder="Pesquisar perfil..."
              emptyMessage="Perfil não encontrado."
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
            disabled={!canSave || createUserMutation.isPending}
            onClick={handleSaveButtonClick}
          >
            {createUserMutation.isPending ? (
              <LoadingLabel label={'Salvando'} />
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
