import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
} from '@tanstack/react-table';
import { ContentsTableToolbar } from './contents-table-toolbar/ContentsTableToolbar';
import { ContentsDataTable } from './ContentsDataTable';
import { Item } from './item';
import { createColumns } from './columns';
import { ITEM_KEYS } from './itemKeys';

interface ContentsTableWithToolbarProps {
  data: Item[];
  addItem: (newItem: Item) => void;
  removeItem: (itemId: number) => void;
  updateItem: (updatedItem: Item) => void;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();
  const name = String(row.getValue(ITEM_KEYS.NAME) || '').toLowerCase();
  const category = String(row.getValue(ITEM_KEYS.CATEGORY) || '').toLowerCase();

  return name.includes(searchValue) || category.includes(searchValue);
};

export const ContentsTableWithToolbar: React.FC<
  ContentsTableWithToolbarProps
> = ({ data, addItem, removeItem, updateItem }) => {
  const columns = React.useMemo(() => createColumns(updateItem), [updateItem]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    state: {
      globalFilter,
    },
  });

  return (
    <div>
      <ContentsTableToolbar table={table} />
      <ContentsDataTable
        data={data}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
        table={table}
      />
    </div>
  );
};
