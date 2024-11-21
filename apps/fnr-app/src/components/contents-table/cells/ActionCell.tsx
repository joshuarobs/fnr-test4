import { Item } from '../item';
import { ITEM_KEYS } from '../itemKeys';
import { CellWrapper } from '../CellWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { Button } from '@react-monorepo/shared';
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';

// Component for rendering the actions cell in the contents table
export const ActionCell = ({
  item,
  localId,
  removeItem,
}: {
  item: Item;
  localId: string;
  removeItem?: (itemId: number) => void;
}) => {
  const handleDelete = () => {
    if (removeItem && item.id) {
      removeItem(item.id);
    }
  };

  return (
    <CellWrapper rowId={localId} columnId={ITEM_KEYS.ACTIONS}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-red-600 focus:bg-red-100 focus:text-red-600"
            onClick={handleDelete}
          >
            <TrashIcon className="mr-1 h-4 w-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(item[ITEM_KEYS.ID].toString())
            }
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CellWrapper>
  );
};
