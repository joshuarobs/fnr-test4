import { Item } from '../item';
import { ITEM_KEYS } from '../itemKeys';
import { CellWrapper } from '../CellWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@react-monorepo/shared';
import { DropdownMenuListItem } from '../../ui/DropdownMenuListItem';
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
        <DropdownMenuContent align="end" className="min-w-[180px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuListItem
            icon={<TrashIcon />}
            onClick={handleDelete}
            danger
          >
            Delete
          </DropdownMenuListItem>
          <DropdownMenuSeparator />
          <DropdownMenuListItem
            onClick={() =>
              navigator.clipboard.writeText(item[ITEM_KEYS.ID].toString())
            }
          >
            Copy payment ID
          </DropdownMenuListItem>
          <DropdownMenuSeparator />
          <DropdownMenuListItem>View customer</DropdownMenuListItem>
          <DropdownMenuListItem>View payment details</DropdownMenuListItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CellWrapper>
  );
};
