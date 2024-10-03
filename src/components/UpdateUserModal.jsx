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
  // DialogTrigger,
} from '@/components/ui/dialog';
// import { HiOutlinePlusCircle } from 'react-icons/hi';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUserApi from '@/hooks/useUserApi';
import { handleError } from '@/helpers/handleError';
import { toast } from '@/hooks/use-toast';

const roles = [
  {
    value: 'USER',
    label: 'Usuário',
  },
  {
    value: 'ADMIN',
    label: 'Administrador',
  },
];

const UpdateUserModal = ({
  userUpdate,
  updateModalOpen,
  setUpdateModalOpen,
}) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData(userUpdate);
    setModalOpen(updateModalOpen);
  }, [updateModalOpen]);

  useEffect(() => {
    if (!modalOpen) setUpdateModalOpen(false);
  }, [modalOpen]);

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCancelButtonClick = () => {
    setUpdateModalOpen(false);
  };

  const { updateUser } = useUserApi();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: () => updateUser(userUpdate.id, userData),
    onSuccess: ({ user }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setModalOpen(false);
      handleCancelButtonClick();
      toast({
        className: 'bg-green-200 text-green-800 border-green-300',
        title: 'Atualização concluída com sucesso!',
        description: `O usuário: ${user.firstName} ${user.lastName} (Email: ${user.email}) foi atualizado no banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toast({
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Erro ao atualizar usuário!',
        description: error.map((err, i) => <p key={i}>{err}</p>),
      });
    },
  });

  const handleUpdateButtonClick = () => {
    updateUserMutation.mutate();
  };

  const canSave = [...Object.values(userData)].every(Boolean);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {/* <DialogTrigger asChild>
        <Button onClick={handleCancelButtonClick}>
          <HiOutlinePlusCircle size={20} className="me-1" />
          Novo usuário
        </Button>
      </DialogTrigger> */}
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
              value={userData.firstName}
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
              value={userData.lastName}
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
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>
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
                  {userData.role
                    ? roles.find((role) => role.value === userData.role)?.label
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
                      {roles.map((role) => (
                        <CommandItem
                          key={role.value}
                          value={role.value}
                          onSelect={(currentValue) => {
                            const selectedRole =
                              currentValue === userData.role
                                ? ''
                                : currentValue;
                            setUserData((prevData) => ({
                              ...prevData,
                              role: selectedRole,
                            }));
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              userData.role === role.value
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
            onClick={handleUpdateButtonClick}
          >
            Salvar modificações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;
