import { ColumnDef } from '@tanstack/react-table';
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
import { ActionCell } from './cells/ActionCell';
import { ItemCategory } from './itemCategories';
import { CellWrapper } from './CellWrapper';
import { ITEM_KEYS } from './itemKeys';
import { GreenTickIcon } from './GreenTickIcon';
import { SortableHeader } from './SortableHeader';

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

const CELL_CONTENT_MARGIN = 'ml-2';

const RightAlignedHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="text-right">{children}</div>
);

const getDifferenceType = (item: Item): 'higher' | 'lower' | 'same' | 'na' => {
  const insuredsQuote = item[ITEM_KEYS.OIS_QUOTE];
  const ourQuote = item[ITEM_KEYS.OUR_QUOTE];

  if (insuredsQuote === null || ourQuote === null) return 'na';
  if (insuredsQuote === ourQuote) return 'same';
  return insuredsQuote > ourQuote ? 'higher' : 'lower';
};

export const createColumns = (
  updateItem: (item: Item) => void,
  removeItem?: (itemId: number) => void
): ColumnDef<Item>[] =>
  [
    {
      accessorKey: ITEM_KEYS.LOCAL_ID,
      header: ({ column }) => <SortableHeader column={column} title="ID" />,
      cell: ({ row }) => {
        const value = row.getValue(ITEM_KEYS.LOCAL_ID) as number;
        return (
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.LOCAL_ID}
          >
            <IdCell value={value} />
          </CellWrapper>
        );
      },
    },
    {
      accessorKey: ITEM_KEYS.NAME,
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
      cell: ({ row, table }) => {
        return (
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.NAME}
          >
            <div className={CELL_CONTENT_MARGIN}>
              <ItemNameCell
                item={row.original}
                updateItem={updateItem}
                filterText={table.getState().globalFilter}
              />
            </div>
          </CellWrapper>
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
        const status = row.original.itemStatus;
        return (
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.ITEM_STATUS}
          >
            <div className={CELL_CONTENT_MARGIN}>
              <ItemStatusBadge itemStatus={status} />
            </div>
          </CellWrapper>
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
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.GROUP}
          >
            <div className={CELL_CONTENT_MARGIN}>
              <GroupCell group={group} />
            </div>
          </CellWrapper>
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
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.CATEGORY}
          >
            <div className={CELL_CONTENT_MARGIN}>
              <CategoryCell
                item={row.original}
                updateItem={updateItem}
                filterText={table.getState().globalFilter}
              />
            </div>
          </CellWrapper>
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
        return (
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.MODEL_SERIAL_NUMBER}
          >
            <div className={CELL_CONTENT_MARGIN}>
              {modelSerialNumber ? (
                <ModelSerialCell modelSerialNumber={modelSerialNumber} />
              ) : null}
            </div>
          </CellWrapper>
        );
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
        return (
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.OIS_QUOTE}
          >
            <InsuredsQuoteCell
              item={row.original}
              updateItem={updateItem}
              isEditable={false} // Set isEditable to false as a test
            />
          </CellWrapper>
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
          return (
            <CellWrapper
              rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
              columnId={ITEM_KEYS.DIFFERENCE}
            >
              <div className="text-right text-muted-foreground">N/A</div>
            </CellWrapper>
          );
        }

        if (insuredsQuote === ourQuote) {
          return (
            <CellWrapper
              rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
              columnId={ITEM_KEYS.DIFFERENCE}
            >
              <div className="text-right">
                Same
                <GreenTickIcon />
              </div>
            </CellWrapper>
          );
        }

        return (
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.DIFFERENCE}
          >
            <div className="flex items-center justify-end">
              <QuoteDifferenceIcon
                insuredsQuote={insuredsQuote}
                ourQuote={ourQuote}
              />
            </div>
          </CellWrapper>
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
        return (
          <CellWrapper
            rowId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            columnId={ITEM_KEYS.OUR_QUOTE}
          >
            <OurQuoteCell item={row.original} updateItem={updateItem} />
          </CellWrapper>
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
      accessorKey: ITEM_KEYS.ACTIONS,
      header: () => <div />,
      cell: ({ row }) => {
        return (
          <ActionCell
            item={row.original}
            localId={row.getValue(ITEM_KEYS.LOCAL_ID)?.toString() ?? ''}
            removeItem={removeItem}
          />
        );
      },
    },
  ] as const;
