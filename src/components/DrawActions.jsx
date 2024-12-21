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

const DrawActions = ({ draw, onView, onViewGames, onUpdate, onDelete }) => {
  console.log(draw);
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
        <DropdownMenuItem onClick={() => onView(draw)}>Ver concurso</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewGames(draw)}>Ver todos os jogos</DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem onClick={() => onUpdate(draw)}>
          Conferir resultado
        </DropdownMenuItem> */}
        {draw.drawnNumbers.length === 0 ? (
          <DropdownMenuItem>
            <CheckDrawResult game={{ draw }} isForAction={true} />
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onClick={() => onDelete(draw)}>
          Deletar concurso
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DrawActions;
