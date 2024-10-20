import { ColumnDef } from '@tanstack/react-table';
import { Item, calculateDifference } from './item';
import { ModelSerialCell } from './ModelSerialCell';
import { BrowseLinkButton } from './BrowseLinkButton';
import { ItemStatusBadge } from './ItemStatusBadge';
import { InsuredsQuoteCell } from './InsuredsQuoteCell';
import { OurQuoteCell } from './OurQuoteCell';
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

// Component for right-aligned header
const RightAlignedHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="text-right">{children}</div>
);

export const createColumns = (
  updateItem: (item: Item) => void
): ColumnDef<Item>[] => [
  {
    accessorKey: ITEM_KEYS.ID,
    header: 'ID',
  },
  {
    accessorKey: ITEM_KEYS.GROUP,
    header: 'Group',
  },
  {
    accessorKey: ITEM_KEYS.NAME,
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue(ITEM_KEYS.NAME) as string;
      return name ? (
        <div className="flex items-center w-full">
          <span className="flex-grow text-left truncate">{name}</span>
          <div className="flex justify-center mx-4">
            <BrowseLinkButton
              tooltipText="Search for item in Google in a new tab"
              searchText={name}
            />
          </div>
        </div>
      ) : null;
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
