import { ColumnDef } from '@tanstack/react-table';
import { Item, calculateDifference } from './item';
import { ModelSerialCell } from './ModelSerialCell';
import { ItemStatusBadge } from './ItemStatusBadge';
import { InsuredsQuoteCell } from './InsuredsQuoteCell';
import { OurQuoteCell } from './OurQuoteCell';
import { ItemNameCell } from './ItemNameCell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { Button } from '@react-monorepo/shared';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ITEM_KEYS } from './itemKeys';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// Standardized margin class for cell content
const CELL_CONTENT_MARGIN = 'ml-4';

// Component for right-aligned header
const RightAlignedHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="text-right">{children}</div>
);

// Reusable sorting header component
const SortableHeader = ({ column, title }: { column: any; title: string }) => (
  <Button
    variant="ghost"
    onClick={() => {
      const currentState = column.getIsSorted();
      if (currentState === false) {
        column.toggleSorting(false);
      } else if (currentState === 'asc') {
        column.toggleSorting(true);
      } else {
        column.clearSorting();
      }
    }}
  >
    {title}
    {column.getIsSorted() === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === 'desc' ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    )}
  </Button>
);

export const createColumns = (
  updateItem: (item: Item) => void
): ColumnDef<Item>[] => [
  {
    accessorKey: ITEM_KEYS.ID,
    header: ({ column }) => <SortableHeader column={column} title="ID" />,
    cell: ({ row }) => {
      return (
        <div className={CELL_CONTENT_MARGIN}>{row.getValue(ITEM_KEYS.ID)}</div>
      );
    },
  },
  {
    accessorKey: ITEM_KEYS.GROUP,
    header: 'Group',
  },
  {
    accessorKey: ITEM_KEYS.NAME,
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className={CELL_CONTENT_MARGIN}>
          <ItemNameCell item={row.original} updateItem={updateItem} />
        </div>
      );
    },
  },
  {
    accessorKey: ITEM_KEYS.CATEGORY,
    header: 'Category',
  },
  {
    accessorKey: ITEM_KEYS.MODEL_SERIAL_NUMBER,
    header: 'Model/Serial number',
    cell: ({ row }) => {
      const modelSerialNumber = row.getValue(ITEM_KEYS.MODEL_SERIAL_NUMBER);
      return modelSerialNumber ? (
        <ModelSerialCell modelSerialNumber={modelSerialNumber as string} />
      ) : null;
    },
  },
  {
    accessorKey: ITEM_KEYS.STATUS,
    header: 'Status',
    meta: {
      headerClassName: 'min-w-[96px]', // min-width, taking
    },
    cell: ({ row }) => {
      const status = row.getValue(ITEM_KEYS.STATUS) as Item['status'];
      return <ItemStatusBadge status={status} />;
    },
  },
  {
    accessorKey: ITEM_KEYS.OIS_QUOTE,
    header: () => <RightAlignedHeader>Insured's quote ($)</RightAlignedHeader>,
    cell: ({ row }) => {
      const oisQuote = row.getValue(ITEM_KEYS.OIS_QUOTE) as number;
      const ourQuote = row.original[ITEM_KEYS.OUR_QUOTE] as number;
      const receiptPhotoUrl = row.original[ITEM_KEYS.RECEIPT_PHOTO_URL];
      return (
        <InsuredsQuoteCell
          oisQuote={oisQuote}
          ourQuote={ourQuote}
          receiptPhotoUrl={receiptPhotoUrl}
        />
      );
    },
  },
  {
    accessorKey: ITEM_KEYS.OUR_QUOTE,
    meta: {
      headerClassName: 'min-w-[112px]', // min-width, taking
    },
    header: () => <RightAlignedHeader>Our quote ($)</RightAlignedHeader>,
    cell: ({ row }) => {
      return <OurQuoteCell item={row.original} updateItem={updateItem} />;
    },
  },
  {
    accessorKey: 'difference',
    header: () => <RightAlignedHeader>Difference ($)</RightAlignedHeader>,
    cell: ({ row }) => {
      const item = row.original;
      const oisQuote = item[ITEM_KEYS.OIS_QUOTE];
      const ourQuote = item[ITEM_KEYS.OUR_QUOTE];

      if (oisQuote === ourQuote) {
        return <div className="text-right">Same</div>;
      }

      const difference = calculateDifference(item);
      return difference !== null ? (
        <div className="text-right">{difference.toFixed(2)}</div>
      ) : (
        <div className="text-right">N/A</div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
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
              onClick={() =>
                navigator.clipboard.writeText(payment[ITEM_KEYS.ID].toString())
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
