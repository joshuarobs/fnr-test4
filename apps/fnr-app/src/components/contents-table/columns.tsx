import { ColumnDef } from '@tanstack/react-table';
import { Item, calculateDifference } from './item';
import { ModelSerialCell } from './ModelSerialCell';
import { BrowseLinkButton } from './BrowseLinkButton';
import { ItemStatusBadge } from './ItemStatusBadge';
import { InsuredsQuoteCell } from './InsuredsQuoteCell';
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

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'group',
    header: 'Group',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
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
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'modelSerialNumber',
    header: 'Model/Serial number',
    cell: ({ row }) => {
      const modelSerialNumber = row.getValue('modelSerialNumber');
      return modelSerialNumber ? (
        <ModelSerialCell modelSerialNumber={modelSerialNumber as string} />
      ) : null;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Item['status'];
      return <ItemStatusBadge status={status} />;
    },
  },
  {
    accessorKey: 'oisquote',
    header: "Insured's quote",
    cell: ({ row }) => {
      const oisQuote = row.getValue('oisquote') as number;
      const receiptPhotoUrl = row.original.receiptPhotoUrl;
      return (
        <InsuredsQuoteCell
          oisQuote={oisQuote}
          receiptPhotoUrl={receiptPhotoUrl}
        />
      );
    },
  },
  {
    accessorKey: 'ourquote',
    header: 'Our quote',
  },
  {
    accessorKey: 'difference',
    header: 'Difference',
    cell: ({ row }) => {
      const item = row.original;
      const oisQuote = item.oisquote;
      const ourQuote = item.ourquote;

      if (oisQuote === ourQuote) {
        return 'Same';
      }

      const difference = calculateDifference(item);
      return difference !== null ? `$${difference.toFixed(2)}` : 'N/A';
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
              onClick={() => navigator.clipboard.writeText(payment.id)}
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
