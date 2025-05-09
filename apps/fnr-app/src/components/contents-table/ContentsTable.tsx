import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
  PaginationState,
} from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';
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

export const ContentsTableWithToolbar = forwardRef<
  { table: any },
  ContentsTableWithToolbarProps
>(({ data, addItem, removeItem, updateItem, claimNumber }, ref) => {
  const columns = React.useMemo(
    () => createColumns({ updateItem, removeItem, claimNumber }),
    [updateItem, removeItem, claimNumber]
  );
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize column order with all column IDs
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((col) => col.id || '').filter(Boolean)
  );

  // Initialize sorting state
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: ITEM_KEYS.LOCAL_ID, desc: false },
  ]);

  // Initialize pagination state from URL parameters (convert from 1-based to 0-based)
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Math.max(0, Number(searchParams.get('page') || '1') - 1),
    pageSize: Number(searchParams.get('pageSize') || '10'),
  });

  // Update URL when pagination changes (convert from 0-based to 1-based)
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', (pagination.pageIndex + 1).toString());
    newParams.set('pageSize', pagination.pageSize.toString());
    setSearchParams(newParams, { replace: true });
  }, [pagination, setSearchParams]);

  // Update pagination when URL changes (convert from 1-based to 0-based)
  useEffect(() => {
    const pageFromUrl = Math.max(
      0,
      Number(searchParams.get('page') || '1') - 1
    );
    const pageSizeFromUrl = Number(searchParams.get('pageSize') || '10');

    setPagination({
      pageIndex: pageFromUrl,
      pageSize: pageSizeFromUrl,
    });
  }, [searchParams]);

  // State for frozen column keys
  const [frozenColumnKeys, setFrozenColumnKeys] = useState<ItemColumnId[]>([
    ITEM_KEYS.LOCAL_ID,
    ITEM_KEYS.NAME,
    ITEM_KEYS.ITEM_STATUS,
  ] as ItemColumnId[]);

  // State for right frozen column keys
  const [frozenRightColumnKeys] = useState([
    ITEM_KEYS.QUANTITY,
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
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    manualPagination: false,
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  // Expose table instance through ref
  useImperativeHandle(ref, () => ({
    table,
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <ContentsTableToolbar<Item>
        table={table}
        frozenColumnKeys={frozenColumnKeys}
        setFrozenColumnKeys={setFrozenColumnKeys}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <ContentsDataTable<Item, unknown>
          table={table}
          frozenColumnKeys={frozenColumnKeys}
          frozenRightColumnKeys={frozenRightColumnKeys}
        />
      </div>
    </div>
  );
});
