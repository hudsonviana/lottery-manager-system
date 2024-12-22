import LoadingLabel from '@/components/LoadingLabel';
import { useAuth } from '@/hooks/useAuth';
import useUserApi from '@/hooks/useUserApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import DataTable, { sortingHeader } from '@/components/DataTable';
import formatDate from '@/helpers/formatDate';
import translateDrawStatus from '@/helpers/translateDrawStatus';
import DrawActions from '@/components/DrawActions';
import translateLotteryType from '@/helpers/translateLotteryType';
import { useNavigate } from 'react-router-dom';
import DrawnNumbersTableRow from '@/components/DrawnNumbersTableRow';
import { TbLockQuestion } from 'react-icons/tb';
// import { MdOutlineLockClock } from 'react-icons/md';
// import { MdHourglassEmpty } from 'react-icons/md';
// import { FcLockLandscape } from 'react-icons/fc';
// import { FcLock } from 'react-icons/fc';
// import { RiLock2Line } from 'react-icons/ri';

const Contests = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { fetchUserDraws } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contests'],
    queryFn: () => fetchUserDraws(auth.user.id),
    // staleTime: 1000 * 60,
  });

  const deleteDrawMutation = useMutation({});

  const handleDeleteDrawAction = (draw) => {
    console.log('Excluindo', draw);
  };

  const columns = [
    {
      header: (info) => sortingHeader({ label: 'Loteria', column: info.column }),
      accessorKey: 'lotteryType',
      cell: (info) => translateLotteryType(info.getValue()),
    },
    {
      header: (info) => sortingHeader({ label: 'Concurso', column: info.column }),
      accessorKey: 'contestNumber',
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
      cell: (info) =>
        info.row.original.status === 'PENDING' ? (
          <TbLockQuestion size={20} color="gray" />
        ) : (
          <DrawnNumbersTableRow drawnNumbers={info.getValue()} />
        ),
    },
    {
      header: (info) => sortingHeader({ label: 'Acumulou', column: info.column }),
      accessorKey: 'accumulated',
      cell: (info) =>
        info.row.original.status === 'PENDING' ? (
          <TbLockQuestion size={20} color="gray" />
        ) : info.getValue() ? (
          'Sim'
        ) : (
          'Não'
        ),
    },
    {
      header: (info) => sortingHeader({ label: 'Qtd jogos', column: info.column }),
      accessorKey: 'countGames',
    },
    {
      header: (info) => sortingHeader({ label: 'Resultado', column: info.column }),
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
