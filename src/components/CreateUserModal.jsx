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

const CreateUserModal = () => {
  return (
    <form>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <HiOutlinePlusCircle size={20} className="me-1" />
            Novo usuário
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cadastrar novo usuário</DialogTitle>
            <DialogDescription>
              Insira os dados do novo usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Nome
              </Label>
              <Input id="firstName" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Sobrenome
              </Label>
              <Input id="lastName" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" className="col-span-3" />
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
                    {value
                      ? roles.find((role) => role.value === value)?.label
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
                              setValue(
                                currentValue === value ? '' : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                value === role.value
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
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default CreateUserModal;
