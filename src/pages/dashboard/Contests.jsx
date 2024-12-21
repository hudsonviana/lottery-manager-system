import LoadingLabel from '@/components/LoadingLabel';
import { useAuth } from '@/hooks/useAuth';
import useUserApi from '@/hooks/useUserApi';
import { useQuery } from '@tanstack/react-query';
import DataTable, { sortingHeader } from '@/components/DataTable';
import formatDate from '@/helpers/formatDate';
import translateDrawStatus from '@/helpers/translateDrawStatus';
import DrawActions from '@/components/DrawActions';
import translateLotteryType from '@/helpers/translateLotteryType';
import { useNavigate } from 'react-router-dom';
import DrawnNumbersTableRow from '@/components/DrawnNumbersTableRow';

const Contests = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { fetchUserDraws } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contests'],
    queryFn: () => fetchUserDraws(auth.user.id),
    // staleTime: 1000 * 60,
  });

  // console.log(data);

  // const handleUpdateDrawAction = (draw) => {
  //   console.log('autualizando', draw);
  // };

  const handleDeleteDrawAction = (draw) => {
    console.log('Excluindo', draw);
  };

  const columns = [
    {
      header: (info) => sortingHeader({ label: 'Concurso', column: info.column }),
      accessorKey: 'contestNumber',
    },
    {
      header: (info) => sortingHeader({ label: 'Loteria', column: info.column }),
      accessorKey: 'lotteryType',
      cell: (info) => translateLotteryType(info.getValue()),
    },
    {
      header: (info) =>
        sortingHeader({
          label: 'Data do sorteio',
          column: info.column,
        }),
      accessorKey: 'drawDate',
      cell: (info) => formatDate(info.getValue(), { withTime: false }),
    },
    {
      header: (info) =>
        sortingHeader({ label: 'Dezenas sorteadas', column: info.column }),
      accessorKey: 'drawnNumbers',
      cell: (info) => <DrawnNumbersTableRow drawnNumbers={info.getValue()} />,
    },
    {
      header: (info) => sortingHeader({ label: 'Acumulado', column: info.column }),
      accessorKey: 'accumulated',
      cell: (info) => (info.getValue() ? 'Sim' : 'Não'),
    },
    // {
    //   header: (info) => sortingHeader({ label: 'Cadastrado em', column: info.column }),
    //   accessorKey: 'createdAt',
    //   cell: (info) => formatDate(info.getValue()),
    // },
    {
      header: (info) => sortingHeader({ label: 'Situação', column: info.column }),
      accessorKey: 'status',
      cell: (info) => translateDrawStatus(info.getValue()),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const draw = row.original;

        return (
          <DrawActions
            draw={draw}
            onView={() => navigate(draw.id)}
            onViewGames={() => navigate(`${draw.id}/games`)}
            // onUpdate={() => handleUpdateDrawAction(draw)}
            onDelete={() => handleDeleteDrawAction(draw)}
          />
        );
      },
    },
  ];

  if (isPending) {
    return (
      <div className="flex items-center container mx-auto py-0">
        <LoadingLabel label={'Carregando...'} />
      </div>
    );
  }

  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  return (
    <div className="container mx-auto py-0">
      <DataTable
        data={data?.userDraws}
        columns={columns}
        defaultSorting={[{ id: 'contestNumber', desc: true }]}
      />
    </div>
  );
};

export default Contests;
