import { ColumnDef, FilterFn } from '@tanstack/react-table';
import { Item, calculateDifference } from './item';
import { ModelSerialCell } from './cells/ModelSerialCell';
import { ItemStatusBadge } from './ItemStatusBadge';
import { InsuredsQuoteCell } from './cells/InsuredsQuoteCell';
import { OurQuoteCell } from './cells/OurQuoteCell';
import { ItemNameCell } from './cells/ItemNameCell';
import { CategoryCell } from './cells/CategoryCell';
import { GroupCell } from './cells/GroupCell';
import { QuoteDifferenceIcon } from './QuoteDifferenceIcon';
import { IdCell } from './cells/IdCell';
import { ItemCategory } from './itemCategories';
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
import { GreenTickIcon } from './GreenTickIcon';
import { SortableHeader } from './SortableHeader';
import { ItemStatus } from './ItemStatus';

// New constant for short readable column names
export const ShortReadibleColumnNames = {
  [ITEM_KEYS.ID]: 'ID',
  [ITEM_KEYS.GROUP]: 'Group',
  [ITEM_KEYS.NAME]: 'Name',
  [ITEM_KEYS.ITEM_STATUS]: 'Status',
  [ITEM_KEYS.CATEGORY]: 'Category',
  [ITEM_KEYS.MODEL_SERIAL_NUMBER]: 'Model/Serial',
  [ITEM_KEYS.OIS_QUOTE]: "Insured's Quote",
  [ITEM_KEYS.OUR_QUOTE]: 'Our quote',
  [ITEM_KEYS.ACTIONS]: '',
};

// Standardized margin class for cell content
const CELL_CONTENT_MARGIN = 'ml-2';

// Component for right-aligned header
const RightAlignedHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="text-right">{children}</div>
);

// Helper function to determine difference type
const getDifferenceType = (item: Item): 'higher' | 'lower' | 'same' | 'na' => {
  const insuredsQuote = item[ITEM_KEYS.OIS_QUOTE];
  const ourQuote = item[ITEM_KEYS.OUR_QUOTE];

  if (insuredsQuote === null || ourQuote === null) return 'na';
  if (insuredsQuote === ourQuote) return 'same';
  return insuredsQuote > ourQuote ? 'higher' : 'lower';
};

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
      accessorKey: ITEM_KEYS.NAME,
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
      cell: ({ row, table }) => {
        return (
          <div className={CELL_CONTENT_MARGIN}>
            <ItemNameCell
              item={row.original}
              updateItem={updateItem}
              filterText={table.getState().globalFilter}
            />
          </div>
        );
      },
      meta: {
        headerClassName: 'min-w-[240px]',
      },
    },
    {
      accessorKey: ITEM_KEYS.ITEM_STATUS,
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      meta: {
        headerClassName: 'min-w-[96px]',
      },
      cell: ({ row }) => {
        // Access status directly from row.original since we know its type
        const status = row.original.itemStatus;
        console.log('Status from row.original:', status); // Debug log
        return (
          <div className={CELL_CONTENT_MARGIN}>
            <ItemStatusBadge itemStatus={status} />
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: 'faceted' as const,
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
      enableColumnFilter: true,
      filterFn: 'faceted' as const,
    },
    {
      accessorKey: ITEM_KEYS.CATEGORY,
      header: ({ column }) => (
        <SortableHeader column={column} title="Category" />
      ),
      cell: ({ row, table }) => {
        return (
          <div className={CELL_CONTENT_MARGIN}>
            <CategoryCell
              item={row.original}
              updateItem={updateItem}
              filterText={table.getState().globalFilter}
            />
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: Array<string | null>) => {
        const category = row.getValue(id) as ItemCategory | null;
        return value.some((filterValue) => category === filterValue);
      },
    },
    {
      accessorKey: ITEM_KEYS.MODEL_SERIAL_NUMBER,
      header: ({ column }) => (
        <SortableHeader column={column} title="Model/Serial number" />
      ),
      cell: ({ row }) => {
        const modelSerialNumber = row.getValue(
          ITEM_KEYS.MODEL_SERIAL_NUMBER
        ) as string | null;
        return modelSerialNumber ? (
          <div className={CELL_CONTENT_MARGIN}>
            <ModelSerialCell modelSerialNumber={modelSerialNumber} />
          </div>
        ) : null;
      },
    },
    {
      accessorKey: ITEM_KEYS.OIS_QUOTE,
      meta: {
        headerClassName: 'min-w-[100px]',
      },
      header: ({ column }) => (
        <RightAlignedHeader>
          <SortableHeader column={column} title="Insured's" line2="quote ($)" />
        </RightAlignedHeader>
      ),
      cell: ({ row }) => {
        const insuredsQuote = row.getValue(ITEM_KEYS.OIS_QUOTE) as
          | number
          | null;
        const receiptPhotoUrl = row.original[ITEM_KEYS.RECEIPT_PHOTO_URL] as
          | string
          | null;
        return (
          <InsuredsQuoteCell
            insuredsQuote={insuredsQuote}
            receiptPhotoUrl={receiptPhotoUrl}
          />
        );
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: Array<string | null>) => {
        const cellValue = row.getValue(id) as number | null;
        return value.some((filterValue) => {
          if (filterValue === 'has-value') {
            return cellValue !== null;
          }
          if (filterValue === null) {
            return cellValue === null;
          }
          return false;
        });
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as number | null;
        const b = rowB.getValue(columnId) as number | null;
        if (a === null) return 1;
        if (b === null) return -1;
        return a - b;
      },
    },
    {
      accessorKey: ITEM_KEYS.DIFFERENCE,
      meta: {
        headerClassName: 'min-w-[90px]',
      },
      header: ({ column }) => (
        <RightAlignedHeader>
          <SortableHeader column={column} title="Diff. ($)" />
        </RightAlignedHeader>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const insuredsQuote = item[ITEM_KEYS.OIS_QUOTE] as number | null;
        const ourQuote = item[ITEM_KEYS.OUR_QUOTE] as number | null;

        if (insuredsQuote === null || ourQuote === null) {
          return <div className="text-right">N/A</div>;
        }

        if (insuredsQuote === ourQuote) {
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
            <QuoteDifferenceIcon
              insuredsQuote={insuredsQuote}
              ourquote={ourQuote}
            />
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: string[]) => {
        const item = row.original;
        const insuredsQuote = item[ITEM_KEYS.OIS_QUOTE];
        const ourQuote = item[ITEM_KEYS.OUR_QUOTE];

        return value.some((filterValue) => {
          if (filterValue === 'na') {
            return insuredsQuote === null || ourQuote === null;
          }
          if (filterValue === 'same') {
            return (
              insuredsQuote !== null &&
              ourQuote !== null &&
              insuredsQuote === ourQuote
            );
          }
          if (filterValue === 'higher') {
            return (
              insuredsQuote !== null &&
              ourQuote !== null &&
              insuredsQuote > ourQuote
            );
          }
          if (filterValue === 'lower') {
            return (
              insuredsQuote !== null &&
              ourQuote !== null &&
              insuredsQuote < ourQuote
            );
          }
          return false;
        });
      },
      sortingFn: (rowA, rowB) => {
        const getDiff = (row: any) => {
          const insuredsQuote = row.original[ITEM_KEYS.OIS_QUOTE] as
            | number
            | null;
          const ourQuote = row.original[ITEM_KEYS.OUR_QUOTE] as number | null;
          if (insuredsQuote === null || ourQuote === null) return null;
          return calculateDifference(row.original);
        };
        const a = getDiff(rowA);
        const b = getDiff(rowB);
        if (a === null) return 1;
        if (b === null) return -1;
        return a - b;
      },
      accessorFn: (row) => getDifferenceType(row),
    },
    {
      accessorKey: ITEM_KEYS.OUR_QUOTE,
      meta: {
        headerClassName: 'min-w-[90px]',
      },
      header: ({ column }) => (
        <RightAlignedHeader>
          <SortableHeader column={column} title="Our quote ($)" />
        </RightAlignedHeader>
      ),
      cell: ({ row }) => {
        return <OurQuoteCell item={row.original} updateItem={updateItem} />;
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: Array<string | null>) => {
        const cellValue = row.getValue(id) as number | null;
        return value.some((filterValue) => {
          if (filterValue === 'has-value') {
            return cellValue !== null;
          }
          if (filterValue === null) {
            return cellValue === null;
          }
          return false;
        });
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as number | null;
        const b = rowB.getValue(columnId) as number | null;
        if (a === null) return 1;
        if (b === null) return -1;
        return a - b;
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
