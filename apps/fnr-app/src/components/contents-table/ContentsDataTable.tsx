import React, { useRef, useEffect, useState } from 'react';
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
import { ITEM_KEYS } from './itemKeys';

interface ContentaDataTableProps<TData, TValue> {
  data: TData[];
  addItem: (newItem: Item) => void;
  removeItem: (itemId: number) => void;
  updateItem: (updatedItem: Item) => void;
  table: Table<TData>;
}

// Type for valid column IDs based on Item type
type ItemColumnId = keyof Item;

export const ContentsDataTable = <TData extends Item, TValue>({
  data,
  addItem,
  removeItem,
  updateItem,
  table,
}: ContentaDataTableProps<TData, TValue>) => {
  const mainTableRef = useRef<HTMLDivElement>(null);
  const frozenTableRef = useRef<HTMLDivElement>(null);

  // State for frozen column keys using ITEM_KEYS values
  const [frozenColumnKeys] = useState<ItemColumnId[]>([
    ITEM_KEYS.ID,
    ITEM_KEYS.GROUP,
    ITEM_KEYS.NAME,
  ] as ItemColumnId[]);

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

  const allColumns = table.getAllColumns();
  const frozenColumns = allColumns.filter((col) =>
    frozenColumnKeys.includes(col.id as ItemColumnId)
  );
  const regularColumns = allColumns.filter(
    (col) => !frozenColumnKeys.includes(col.id as ItemColumnId)
  );

  return (
    <div className="w-full">
      <div className={styles.tableContainer} ref={mainTableRef}>
        {/* Frozen Columns */}
        <div className={styles.frozenColumnsWrapper} ref={frozenTableRef}>
          <UITable className={styles.frozenTable}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers
                    .filter((header) =>
                      frozenColumnKeys.includes(
                        header.column.id as ItemColumnId
                      )
                    )
                    .map((header) => (
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
                        .filter((cell) =>
                          frozenColumnKeys.includes(
                            cell.column.id as ItemColumnId
                          )
                        )
                        .map((cell) => (
                          <TableCell key={cell.id}>
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
