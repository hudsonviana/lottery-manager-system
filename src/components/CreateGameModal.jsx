import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LOTTERY_TYPE } from '@/consts/Enums';
import BettingSlip from './BettingSlip';
import SelectInput from './SelectInput';
import LoadingLabel from './LoadingLabel';
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
import useGameApi from '@/hooks/useGameApi';
import useDrawApi from '@/hooks/useDrawApi';
import { useAuth } from '@/hooks/useAuth';
import useToastAlert from '@/hooks/useToastAlert';
import { handleError } from '@/helpers/handleError';
import { HiOutlinePlusCircle } from 'react-icons/hi';

const newGameDataInitialState = {
  gameNumbers: '',
  ticketPrice: 0,
  contestNumber: 0,
  drawDate: '',
  lotteryType: '',
  groupId: null,
};

const parseHTML = (htmlString) => {
  // Create a new DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Extract game numbers
  const extractNumbers = (label) =>
    Array.from(doc.querySelectorAll('h2'))
      .find((h) => h.textContent?.includes(label))
      ?.textContent?.match(/\d+/g) || [];

  const gameA = extractNumbers('Aposta A');
  const gameB = extractNumbers('Aposta B');
  const gameC = extractNumbers('Aposta C');

  // Extract ticket price
  const totalCell = Array.from(doc.querySelectorAll('td')).find((td) =>
    td.textContent.includes('TOTAL:')
  );
  const ticketPriceText = totalCell ? totalCell.textContent : '0';
  const ticketPrice = parseFloat(
    ticketPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')
  );

  // Extract contest number and draw date
  let contestNumber = null;
  doc.querySelectorAll('h2').forEach((h) => {
    const match = h.textContent.match(/CONCURSO (\d+)/);
    if (match) contestNumber = parseInt(match[1], 10);
  });

  // Create the final object
  return {
    gameNumbers: { gameA, gameB, gameC },
    ticketPrice,
    contestNumber,
    lotteryType: 'MEGA_SENA',
  };
};

const CreateGameModal = ({ groupOptions }) => {
  const { auth } = useAuth();
  const [newGameData, setNewGameData] = useState(newGameDataInitialState);
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState(null);
  const { toastAlert } = useToastAlert();

  const { addGame } = useGameApi();
  const queryClient = useQueryClient();

  const createGameMutation = useMutation({
    mutationFn: (gameData) => addGame(auth.user.id, gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      handleCancelButtonClick();
      toastAlert({
        type: 'success',
        title: 'Jogo cadastrado!',
        message: 'Jogo salvo no banco de dados com sucesso!',
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao cadastrar jogo!',
        message: error,
      });
    },
  });

  const { fetchDrawResult } = useDrawApi();
  const contestData = useQuery({
    queryKey: ['contestData', newGameData.lotteryType, newGameData.contestNumber],
    queryFn: () =>
      fetchDrawResult(
        newGameData.lotteryType.replace('_', '').toLowerCase(),
        newGameData.contestNumber,
        { prevContest: true }
      ),
    enabled: Boolean(
      newGameData.lotteryType && String(newGameData.contestNumber).length === 4
    ),
  });

  useEffect(() => {
    if (contestData.isFetching) {
      setNewGameData((prev) => ({ ...prev, drawDate: 'Buscando...' }));
    }

    if (contestData.isSuccess) {
      if (contestData.data.code === 'ERR_NETWORK') {
        toastAlert({
          type: 'danger',
          title: 'Erro de rede',
          message:
            'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
        });
      }

      setNewGameData((prev) => ({
        ...prev,
        drawDate:
          contestData.data?.response?.status === 500
            ? 'Indefinida'
            : contestData.data?.dataProximoConcurso,
      }));
    }

    if (contestData.isError) {
      setNewGameData((prev) => ({
        ...prev,
        drawDate: 'Erro: Tente novamente',
      }));
    }
  }, [contestData.isFetching]);

  const handleInputChange = (e) => {
    const { type, name } = e.target;
    const value = e.target[type === 'checkbox' ? 'checked' : 'value'];

    const newValue = name === 'contestNumber' ? Number(value) : value;

    setNewGameData((prevData) => ({
      ...prevData,
      drawDate: '',
      [name]: newValue,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlString = e.target.result;
        const parsedData = parseHTML(htmlString);
        setNewGameData((prev) => ({
          ...prev,
          ...parsedData,
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleLotteryChange = (selectedLottery) => {
    setNewGameData((prevData) => ({
      ...prevData,
      lotteryType: selectedLottery,
    }));
  };

  const handleGroupChange = (selectedGroup) => {
    setNewGameData((prevData) => ({
      ...prevData,
      groupId: selectedGroup,
    }));
  };

  const handleSaveButtonClick = () => {
    createGameMutation.mutate(newGameData);
  };

  const handleCancelButtonClick = () => {
    setModalOpen(false);
    setAction(null);
    setNewGameData(newGameDataInitialState);
  };

  const handleActions = (actionType) => {
    setAction(actionType);
  };

  const resetAction = () => {
    setAction(null);
  };

  const { groupId, ...restGameData } = newGameData;
  const canSave = Object.values(restGameData).every(Boolean);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleCancelButtonClick}>
          <HiOutlinePlusCircle size={20} className="me-1" />
          Novo jogo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[720px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo jogo</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>
              Insira abaixo os dados do novo jogo ou importe um comprovante ao lado:
            </span>
            <Input
              id="file"
              type="file"
              name="file"
              onChange={handleFileChange}
              className="w-full"
            />
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
                  value={newGameData.lotteryType}
                  onChange={handleLotteryChange}
                  placeholder="Selecione a loteria..."
                  searchPlaceholder="Pesquisar loteria..."
                  emptyMessage="Loteria não encontrada"
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
                  value={newGameData.contestNumber || ''}
                />
              </div>

              <div className="grid items-center gap-1">
                <Label htmlFor="drawDate" className="text-left">
                  Data do sorteio
                </Label>
                <Input
                  id="drawDate"
                  name="drawDate"
                  className={`${
                    newGameData?.drawDate === 'Indefinida'
                      ? 'text-red-600 font-semibold'
                      : null
                  } cursor-not-allowed`}
                  value={newGameData.drawDate}
                  size={8}
                  readOnly
                />
              </div>

              <div className="grid items-center gap-1">
                <Label htmlFor="lotteryType" className="text-left">
                  Grupo (opcional)
                </Label>
                <SelectInput
                  options={groupOptions}
                  value={newGameData.groupId}
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
              setNewGameData={setNewGameData}
              importedGameNumbers={{
                gameA: [],
                gameB: [],
                gameC: [],
              }}
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
              disabled={!canSave || createGameMutation.isPending}
              onClick={handleSaveButtonClick}
            >
              {createGameMutation.isPending ? (
                <LoadingLabel label={'Salvando'} />
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
