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
  DialogTrigger,
} from '@/components/ui/dialog';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleError } from '@/helpers/handleError';
import LoadingLabel from './LoadingLabel';
import useToastAlert from '@/hooks/useToastAlert';
import useGroupApi from '@/hooks/useGroupApi';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import SelectInput from './SelectInput';
import { GROUP_THEME } from '@/consts/Enums';

const CreateGroupModal = () => {
  const { toastAlert } = useToastAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    isPool: false,
    // theme: 'grey',
  });

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];
    setNewGroupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleThemeChange = (selectedTheme) => {
    setNewGroupData((prevData) => ({
      ...prevData,
      theme: selectedTheme,
    }));
  };

  const handleRadioClick = (e) => {
    if (e.target.value)
      setNewGroupData((prevData) => ({
        ...prevData,
        isPool: e.target.value === 'true',
      }));
  };

  const { addGroup } = useGroupApi();
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: addGroup,
    onSuccess: ({ group }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      handleCancelButtonClick();
      toastAlert({
        type: 'success',
        title: 'Grupo cadastrado!',
        message: `O grupo "${group.name}" foi criado no banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao criar grupo!',
        message: error,
      });
    },
  });

  const handleSaveButtonClick = () => {
    createGroupMutation.mutate(newGroupData);
  };

  const handleCancelButtonClick = () => {
    setModalOpen(false);
    setNewGroupData({
      name: '',
      description: '',
      isPool: false,
      // theme: 'gray',
    });
  };

  const { isPool, ...dataWithoutIsPool } = newGroupData;
  const canSave = [...Object.values(dataWithoutIsPool)].every(Boolean);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleCancelButtonClick}>
          <HiOutlinePlusCircle size={20} className="me-1" />
          Novo grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo grupo</DialogTitle>
          <DialogDescription>Insira os dados do novo grupo.</DialogDescription>
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
              value={newGroupData.name}
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
              value={newGroupData.description}
              maxLength={250}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isPool" className="text-right">
              É bolão?
            </Label>

            <RadioGroup defaultValue="no">
              <div className="flex flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={true} id="yes" onClick={handleRadioClick} />
                  <Label htmlFor="yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={false} id="no" onClick={handleRadioClick} />
                  <Label htmlFor="no">Não</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Tema
            </Label>

            <SelectInput
              options={GROUP_THEME}
              value={newGroupData.theme}
              onChange={handleThemeChange}
              placeholder="Selecione o tema..."
              searchPlaceholder="Pesquisar tema..."
              emptyMessage="Tema não encontrado."
              withStyles={true}
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
            disabled={!canSave || createGroupMutation.isPending}
            onClick={handleSaveButtonClick}
          >
            {createGroupMutation.isPending ? (
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

export default CreateGroupModal;
