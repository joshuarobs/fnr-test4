import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
  FilterFns,
  getFacetedRowModel,
  getFacetedUniqueValues,
  SortingState,
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
  claimNumber: string;
}

// Type for valid column IDs based on Item type
type ItemColumnId = keyof Item;

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();
  const name = String(row.getValue(ITEM_KEYS.NAME) || '').toLowerCase();
  const category = String(row.getValue(ITEM_KEYS.CATEGORY) || '').toLowerCase();

  return name.includes(searchValue) || category.includes(searchValue);
};

// OR filter function for faceted filters
const facetedFilter: FilterFn<Item> = (
  row,
  columnId,
  filterValues: Array<string | null>
) => {
  if (!filterValues?.length) return true;
  const value = row.getValue(columnId);
  return filterValues.some((filterValue) => value === filterValue);
};

// Extend FilterFns to include our custom filters
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<any>;
    faceted: FilterFn<any>;
  }
}

export const ContentsTableWithToolbar: React.FC<
  ContentsTableWithToolbarProps
> = ({ data, addItem, removeItem, updateItem, claimNumber }) => {
  const columns = React.useMemo(
    () => createColumns({ updateItem, removeItem, claimNumber }),
    [updateItem, removeItem, claimNumber]
  );
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Initialize column order with all column IDs
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((col) => col.id || '').filter(Boolean)
  );

  // Initialize sorting state
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: ITEM_KEYS.LOCAL_ID, desc: false },
  ]);

  // State for frozen column keys
  const [frozenColumnKeys, setFrozenColumnKeys] = useState<ItemColumnId[]>([
    ITEM_KEYS.LOCAL_ID,
    ITEM_KEYS.NAME,
    ITEM_KEYS.ITEM_STATUS,
  ] as ItemColumnId[]);

  // State for right frozen column keys
  const [frozenRightColumnKeys] = useState([
    ITEM_KEYS.OIS_QUOTE,
    ITEM_KEYS.DIFFERENCE,
    ITEM_KEYS.OUR_QUOTE,
    ITEM_KEYS.ACTIONS,
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
      faceted: facetedFilter,
    },
    state: {
      globalFilter,
      columnOrder,
      sorting,
    },
    onSortingChange: setSorting,
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
        table={table}
        frozenColumnKeys={frozenColumnKeys}
        frozenRightColumnKeys={frozenRightColumnKeys}
      />
    </div>
  );
};
