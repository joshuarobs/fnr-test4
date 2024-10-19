import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@react-monorepo/shared';

import { placeholderContentsData } from './placeholderContentsData';
import { ModelSerialCell } from './ModelSerialCell';
import { ItemStatusBadge } from './ItemStatusBadge';
import { BrowseLinkButton } from './BrowseLinkButton';

import { ContentsTableSortableHeader } from './ContentsTableSortableHeader';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const ContentsTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalAmount = (data as any[]).reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={`${
                  index % 2 === 0 ? 'bg-gray-100' : ''
                } min-h-[53px]!`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // TODO: EMPTY STATE
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Total</TableCell>
            <TableCell className="text-right">
              ${totalAmount.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export { ContentsTable };
