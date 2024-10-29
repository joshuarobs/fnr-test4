import { ColumnDef } from '@tanstack/react-table';
import { Item, calculateDifference } from './item';
import { ModelSerialCell } from './cells/ModelSerialCell';
import { ItemStatusBadge } from './ItemStatusBadge';
import { InsuredsQuoteCell } from './cells/InsuredsQuoteCell';
import { OurQuoteCell } from './cells/OurQuoteCell';
import { ItemNameCell } from './cells/ItemNameCell';
import { GroupCell } from './cells/GroupCell';
import { QuoteDifferenceIcon } from './QuoteDifferenceIcon';
import { IdCell } from './cells/IdCell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import { Button } from '@react-monorepo/shared';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ITEM_KEYS } from './itemKeys';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { GreenTickIcon } from './GreenTickIcon';
import cliTruncate from 'cli-truncate';

// New constant for short readable column names
export const ShortReadibleColumnNames = {
  [ITEM_KEYS.ID]: 'ID',
  [ITEM_KEYS.GROUP]: 'Group',
  [ITEM_KEYS.NAME]: 'Name',
  [ITEM_KEYS.STATUS]: 'Status',
  [ITEM_KEYS.CATEGORY]: 'Category',
  [ITEM_KEYS.MODEL_SERIAL_NUMBER]: 'Model/Serial',
  [ITEM_KEYS.OIS_QUOTE]: "Insured's Quote",
  [ITEM_KEYS.OUR_QUOTE]: 'Our quote',
  [ITEM_KEYS.ACTIONS]: '',
};

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
    className="w-full justify-start"
  >
    <div className="flex items-center">
      {title}
      {column.getIsSorted() === 'asc' ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </div>
  </Button>
);

export const createColumns = (
  updateItem: (item: Item) => void
): ColumnDef<Item>[] =>
  [
    {
      accessorKey: ITEM_KEYS.ID,
      header: ({ column }) => <SortableHeader column={column} title="ID" />,
      cell: ({ row }) => {
        const value = row.getValue(ITEM_KEYS.ID) as number;
        return <IdCell value={value} />;
      },
    },
    {
      accessorKey: ITEM_KEYS.GROUP,
      header: ({ column }) => <SortableHeader column={column} title="Group" />,
      cell: ({ row }) => {
        const group = row.getValue(ITEM_KEYS.GROUP) as string;
        return (
          <div className={CELL_CONTENT_MARGIN}>
            <GroupCell group={group} />
          </div>
        );
      },
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
      meta: {
        headerClassName: 'min-w-[240px]',
      },
    },
    {
      accessorKey: ITEM_KEYS.STATUS,
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      meta: {
        headerClassName: 'min-w-[96px]', // min-width, taking
      },
      cell: ({ row }) => {
        const status = row.getValue(ITEM_KEYS.STATUS) as Item['status'];
        return (
          <div className={CELL_CONTENT_MARGIN}>
            <ItemStatusBadge status={status} />
          </div>
        );
      },
    },
    {
      accessorKey: ITEM_KEYS.CATEGORY,
      header: ({ column }) => (
        <SortableHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        return (
          <div className={CELL_CONTENT_MARGIN}>
            {row.getValue(ITEM_KEYS.CATEGORY)}
          </div>
        );
      },
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
      accessorKey: ITEM_KEYS.OIS_QUOTE,
      header: () => (
        <RightAlignedHeader>Insured's quote ($)</RightAlignedHeader>
      ),
      cell: ({ row }) => {
        const oisQuote = row.getValue(ITEM_KEYS.OIS_QUOTE) as number;
        const receiptPhotoUrl = row.original[ITEM_KEYS.RECEIPT_PHOTO_URL];
        return (
          <InsuredsQuoteCell
            oisQuote={oisQuote}
            receiptPhotoUrl={receiptPhotoUrl}
          />
        );
      },
    },
    {
      accessorKey: 'difference',
      header: () => <RightAlignedHeader>Difference ($)</RightAlignedHeader>,
      cell: ({ row }) => {
        const item = row.original;
        const oisQuote = item[ITEM_KEYS.OIS_QUOTE] as number | null;
        const ourQuote = item[ITEM_KEYS.OUR_QUOTE] as number | null;

        if (oisQuote === null || ourQuote === null) {
          return <div className="text-right">N/A</div>;
        }

        if (oisQuote === ourQuote) {
          return (
            <div className="text-right">
              Same
              <GreenTickIcon />
            </div>
          );
        }

        const difference = calculateDifference(item);
        return (
          <div className="flex items-center justify-end">
            <QuoteDifferenceIcon oisquote={oisQuote} ourquote={ourQuote} />
          </div>
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
      accessorKey: ITEM_KEYS.ACTIONS,
      header: () => <div />,
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
                  navigator.clipboard.writeText(
                    payment[ITEM_KEYS.ID].toString()
                  )
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
  ] as const;
