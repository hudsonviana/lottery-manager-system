import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import CheckDrawResult from './CheckDrawResult';

const DrawActions = ({ draw, onView, onViewGames, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        {draw.status === 'PENDING' ? (
          <>
            <DropdownMenuItem>
              <CheckDrawResult draw={draw} isForAction={true} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem onClick={() => onViewGames(draw)}>
          Ver todos os jogos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onView(draw)}>
          Dados do concurso
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(draw)}>
          Excluir concurso
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DrawActions;
