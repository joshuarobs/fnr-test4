import React, { useRef, useEffect } from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@react-monorepo/shared';
import { useDispatch } from 'react-redux';
import {
  moveSelectionUp,
  moveSelectionDown,
  moveSelectionLeft,
  moveSelectionRight,
} from '../../store/features/selectedCellSlice';
import { Item } from './item';
import { DataTablePagination } from './DataTablePagination';
import styles from './ContentsDataTable.module.css';

interface ContentaDataTableProps<TData, TValue> {
  table: Table<TData>;
  frozenColumnKeys: (keyof Item)[];
  frozenRightColumnKeys: string[];
}

export const ContentsDataTable2 = <TData extends Item, TValue>({
  table,
  frozenColumnKeys,
  frozenRightColumnKeys,
}: ContentaDataTableProps<TData, TValue>) => {
  const dispatch = useDispatch();
  const mainTableRef = useRef<HTMLDivElement>(null);
  const frozenTableRef = useRef<HTMLDivElement>(null);
  const frozenRightTableRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const totalRows = table.getRowModel().rows.length;

      // Get all visible columns in order (frozen left, main, frozen right)
      const visibleColumns = table
        .getAllColumns()
        .filter((column) => column.getIsVisible())
        .map((column) => column.id);

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          dispatch(moveSelectionUp());
          break;
        case 'ArrowDown':
          e.preventDefault();
          dispatch(moveSelectionDown({ maxRows: totalRows }));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          dispatch(moveSelectionLeft({ visibleColumns }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          dispatch(moveSelectionRight({ visibleColumns }));
          break;
      }
    };

    // Add event listener to window to ensure it catches all keyboard events
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, table]);

  // Sync scroll positions between frozen and main tables
  useEffect(() => {
    const mainTable = mainTableRef.current;
    const frozenTable = frozenTableRef.current;
    const frozenRightTable = frozenRightTableRef.current;

    if (!mainTable || (!frozenTable && !frozenRightTable)) return;

    const handleScroll = () => {
      if (frozenTable) {
        frozenTable.scrollTop = mainTable.scrollTop;
      }
      if (frozenRightTable) {
        frozenRightTable.scrollTop = mainTable.scrollTop;
      }
    };

    mainTable.addEventListener('scroll', handleScroll);
    return () => mainTable.removeEventListener('scroll', handleScroll);
  }, []);

  const allColumns = table.getAllColumns();

  return (
    <div className="w-full">
      <div className={styles.tableContainer} ref={mainTableRef}>
        {/* Left Frozen Columns */}
        <div className={styles.frozenColumnsWrapper} ref={frozenTableRef}>
          <UITable className={styles.frozenTable}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers
                    .filter((header) =>
                      frozenColumnKeys.includes(header.column.id as keyof Item)
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
                            cell.column.id as keyof Item
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

        {/* Right Frozen Columns */}
        <div
          className={styles.frozenRightColumnsWrapper}
          ref={frozenRightTableRef}
        >
          <UITable className={styles.frozenTable}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers
                    .filter((header) =>
                      frozenRightColumnKeys.includes(header.column.id)
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
                          frozenRightColumnKeys.includes(cell.column.id)
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
