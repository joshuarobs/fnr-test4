import React from 'react';
import { ColumnDef, flexRender, Table } from '@tanstack/react-table';

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@react-monorepo/shared';

import { Item } from './item';
import { DataTablePagination } from './DataTablePagination';

interface DataTableProps<TData, TValue> {
  data: TData[];
  addItem: (newItem: Item) => void;
  removeItem: (itemId: number) => void;
  updateItem: (updatedItem: Item) => void;
  table: Table<TData>;
}

const ContentsTable = <TData extends Item, TValue>({
  data,
  addItem,
  removeItem,
  updateItem,
  table,
}: DataTableProps<TData, TValue>) => {
  return (
    <div>
      <UITable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.headerClassName}
                >
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
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </UITable>
      <DataTablePagination table={table} />
    </div>
  );
};

export { ContentsTable };
