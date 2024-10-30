import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
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

// Type for valid column IDs based on Item type
type ItemColumnId = keyof Item;

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

  // Initialize column order with all column IDs
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((col) => col.id || '').filter(Boolean)
  );

  // State for frozen column keys
  const [frozenColumnKeys, setFrozenColumnKeys] = useState<ItemColumnId[]>([
    ITEM_KEYS.ID,
    ITEM_KEYS.GROUP,
    ITEM_KEYS.NAME,
  ] as ItemColumnId[]);

  // State for right frozen column keys
  const [frozenRightColumnKeys] = useState([
    ITEM_KEYS.OIS_QUOTE,
    'difference',
    ITEM_KEYS.OUR_QUOTE,
  ]);

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
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
  });

  return (
    <div className="w-full">
      <ContentsTableToolbar<Item>
        table={table}
        frozenColumnKeys={frozenColumnKeys}
        setFrozenColumnKeys={setFrozenColumnKeys}
      />
      <ContentsDataTable<Item, unknown>
        data={data}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
        table={table}
        frozenColumnKeys={frozenColumnKeys}
        frozenRightColumnKeys={frozenRightColumnKeys}
      />
    </div>
  );
};
