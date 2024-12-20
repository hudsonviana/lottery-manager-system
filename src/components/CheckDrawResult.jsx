import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import useDrawApi from '@/hooks/useDrawApi';
import LoadingLabel from './LoadingLabel';
import useToastAlert from '@/hooks/useToastAlert';

const CheckDrawResult = ({ game }) => {
  const { lotteryType, contestNumber } = game.draw;
  const { fetchDrawResult } = useDrawApi();
  const { toastAlert } = useToastAlert();

  const checkDrawResult = useMutation({
    mutationFn: () =>
      fetchDrawResult(lotteryType.replace('_', '').toLowerCase(), contestNumber),
    onError: (error) => console.log(error),
    onSuccess: (data) => {
      console.log(data);
      if (data.code === 'ERR_NETWORK') {
        return toastAlert({
          type: 'danger',
          title: 'Erro de conexão',
          message: 'Tente mais tarde.',
        });
      }
      // se não der erro, salvar os dados recebidos da API do sorteio no banco de dados
    },
  });

  const handleCheckDrawResultButtonClick = () => {
    // checkDrawResult.mutate();
    // console.log('lotteryType:', lotteryType.replace('_', '').toLowerCase());
    // console.log('contestNumber:', contestNumber);
  };

  return (
    <div>
      <Button
        onClick={() => checkDrawResult.mutate()}
        disabled={checkDrawResult.isPending}
      >
        {checkDrawResult.isPending ? (
          <LoadingLabel label={'Aguarde...'} />
        ) : (
          'Conferir sorteio'
        )}
      </Button>

      {/* {checkDrawResult?.data?.code === 'ERR_NETWORK' ? (
        <p className="text-red-600">Ocorreu um erro de conexão. Tente mais tarde.</p>
      ) : null} */}
    </div>
  );
};

export default CheckDrawResult;
