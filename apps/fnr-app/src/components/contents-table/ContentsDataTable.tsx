import React, { useRef, useEffect } from 'react';
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
import styles from './ContentsDataTable.module.css';

interface ContentaDataTableProps<TData, TValue> {
  data: TData[];
  addItem: (newItem: Item) => void;
  removeItem: (itemId: number) => void;
  updateItem: (updatedItem: Item) => void;
  table: Table<TData>;
}

export const ContentsDataTable = <TData extends Item, TValue>({
  data,
  addItem,
  removeItem,
  updateItem,
  table,
}: ContentaDataTableProps<TData, TValue>) => {
  const mainTableRef = useRef<HTMLDivElement>(null);
  const frozenTableRef = useRef<HTMLDivElement>(null);

  // Sync scroll positions between frozen and main tables
  useEffect(() => {
    const mainTable = mainTableRef.current;
    const frozenTable = frozenTableRef.current;

    if (!mainTable || !frozenTable) return;

    const handleScroll = () => {
      if (frozenTable) {
        frozenTable.scrollTop = mainTable.scrollTop;
      }
    };

    mainTable.addEventListener('scroll', handleScroll);
    return () => mainTable.removeEventListener('scroll', handleScroll);
  }, []);

  const frozenColumns = table.getAllColumns().slice(0, 3);
  const regularColumns = table.getAllColumns().slice(3);

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      <div className={styles.tableContainer} ref={mainTableRef}>
        {/* Frozen Columns */}
        <div className={styles.frozenColumnsWrapper} ref={frozenTableRef}>
          <UITable className={styles.frozenTable}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.slice(0, 3).map((header) => (
                    <TableHead
                      key={header.id}
                      className={`${styles.frozenHeaderCell} ${header.column.columnDef.meta?.headerClassName}`}
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
              {table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-100' : ''
                      } min-h-[53px]!`}
                    >
                      {row
                        .getVisibleCells()
                        .slice(0, 3)
                        .map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={styles.frozenCell}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </UITable>
        </div>

        {/* Main Table */}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
