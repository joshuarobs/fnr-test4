import { Button } from '@react-monorepo/shared';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableHeaderProps {
  column: any;
  title?: string;
  line2?: string;
}

export const SortableHeader = ({
  column,
  title,
  line2,
}: SortableHeaderProps) => {
  const handleSort = () => {
    const currentState = column.getIsSorted();
    if (currentState === false) {
      column.toggleSorting(false);
    } else if (currentState === 'asc') {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
    }
  };

  const SortIcon = () =>
    column.getIsSorted() === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === 'desc' ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    );

  return (
    <Button variant="ghost" onClick={handleSort}>
      <div className="flex items-center">
        <div className="leading-tight text-right">
          <div>{title}</div>
          {line2 && <div>{line2}</div>}
        </div>
        <SortIcon />
      </div>
    </Button>
  );
};
