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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUserApi from '@/hooks/useUserApi';
import { handleError } from '@/helpers/handleError';
import { USER_ROLES } from '@/consts/Enums';
import LoadingLabel from './LoadingLabel';
import useToastAlert from '@/hooks/useToastAlert';

const UpdateUserModal = ({
  user,
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  isOwnUser = false,
}) => {
  const [open, setOpen] = useState(false);
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

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {userUpdateData.role
                      ? USER_ROLES.find((role) => role.value === userUpdateData.role)
                          ?.label
                      : 'Selecione o perfil...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Pesquisar perfil..." />
                    <CommandList>
                      <CommandEmpty>Perfil não encontrado.</CommandEmpty>
                      <CommandGroup>
                        {USER_ROLES.map((role) => (
                          <CommandItem
                            key={role.value}
                            value={role.value}
                            onSelect={(currentValue) => {
                              const selectedRole =
                                currentValue === userUpdateData.role ? '' : currentValue;
                              setUserUpdateData((prevData) => ({
                                ...prevData,
                                role: selectedRole,
                              }));
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                userUpdateData.role === role.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {role.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
