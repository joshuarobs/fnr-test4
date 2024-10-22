import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { ContentsTableToolbar } from './contents-table-toolbar/ContentsTableToolbar';
import { ContentsTable } from './ContentsTable';
import { Item } from './item';
import { createColumns } from './columns';

interface ContentsTableWithToolbarProps {
  data: Item[];
  addItem: (newItem: Item) => void;
  removeItem: (itemId: number) => void;
  updateItem: (updatedItem: Item) => void;
}

export const ContentsTableWithToolbar: React.FC<
  ContentsTableWithToolbarProps
> = ({ data, addItem, removeItem, updateItem }) => {
  const columns = React.useMemo(() => createColumns(updateItem), [updateItem]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <ContentsTableToolbar table={table} />
      <ContentsTable
        data={data}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
        table={table}
      />
    </div>
  );
};
