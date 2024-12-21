import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import useDrawApi from '@/hooks/useDrawApi';
import LoadingLabel from './LoadingLabel';
import useToastAlert from '@/hooks/useToastAlert';
import { handleError } from '@/helpers/handleError';

const CheckDrawResult = ({ game }) => {
  const { lotteryType, contestNumber } = game.draw;
  const { fetchDrawResult, updateDraw } = useDrawApi();
  const { toastAlert } = useToastAlert();
  const queryClient = useQueryClient();

  const updateDrawMutation = useMutation({
    mutationFn: ({ contestNumber, drawData }) => updateDraw({ contestNumber, drawData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests', game.draw.id, 'games'] });
      toastAlert({
        type: 'success',
        title: 'Sorteio conferido!',
        message: 'O resultado do sorteio foi salvo no banco de dados.',
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao salvar o resultado!',
        message: error,
      });
    },
  });

  const checkDrawResult = useMutation({
    mutationFn: () =>
      fetchDrawResult(lotteryType.replace('_', '').toLowerCase(), contestNumber),
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao conferir o sorteio!',
        message: error,
      });
    },
    onSuccess: (data) => {
      if (data.code === 'ERR_NETWORK') {
        return toastAlert({
          type: 'danger',
          title: 'Erro de rede',
          message:
            'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
        });
      }

      if (data.code === 'ERR_BAD_RESPONSE') {
        return toastAlert({
          type: 'danger',
          title: 'Erro ao consultar o sorteio',
          message: 'Concurso indisponível.',
        });
      }

      if (data.listaDezenas) {
        const drawData = data;
        updateDrawMutation.mutate({ contestNumber, drawData });
      } else {
        return toastAlert({
          type: 'danger',
          title: 'Erro ao consultar o sorteio',
          message: 'Concurso indisponível.',
        });
      }
    },
  });

  return (
    <Button
      onClick={() => checkDrawResult.mutate()}
      disabled={checkDrawResult.isPending || updateDrawMutation.isPending}
    >
      {checkDrawResult.isPending ? (
        <LoadingLabel label={'Buscando dados...'} />
      ) : updateDrawMutation.isPending ? (
        <LoadingLabel label={'Salvando resultado...'} />
      ) : (
        'Conferir sorteio'
      )}
    </Button>
  );
};

export default CheckDrawResult;
