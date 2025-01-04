import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { MoreHorizontal } from 'lucide-react';

const GroupActions = ({ group, onView, onUpdate, onDelete }) => {
  const { auth } = useAuth();
  const isDisabled = group.creator.id !== auth.user.id;

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
        <DropdownMenuItem onClick={() => onView(group)}>
          Visualizar grupo
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onUpdate(group)} disabled={isDisabled}>
          Editar grupo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(group)} disabled={isDisabled}>
          Deletar grupo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupActions;
