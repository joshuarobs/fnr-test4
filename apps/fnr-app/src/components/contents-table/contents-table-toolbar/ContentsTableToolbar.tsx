import React from 'react';
import { Search } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { InputClearable } from '@react-monorepo/shared';
import { DataColumnToggleButton } from './DataColumnToggleButton';
import { FreezeColumnToggleButton } from './FreezeColumnToggleButton';
import { Item } from '../item';
import { DataTableFacetedFilterButton } from './DataTableFacetedFilterButton';
import { ItemCategory } from '../itemCategories';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { ItemStatus } from '../ItemStatus';

interface ContentsTableToolbarProps<TData> {
  table: Table<TData>;
  frozenColumnKeys: (keyof Item)[];
  setFrozenColumnKeys: React.Dispatch<React.SetStateAction<(keyof Item)[]>>;
}

const statusOptions = [
  { label: 'Not Repairable', value: ItemStatus.NR },
  { label: 'Replacement Same', value: ItemStatus.RS },
  { label: 'VPOL', value: ItemStatus.VPOL },
];

const categoryOptions = Object.values(ItemCategory).map((category) => ({
  label: category,
  value: category,
}));

export function ContentsTableToolbar<TData>({
  table,
  frozenColumnKeys,
  setFrozenColumnKeys,
}: ContentsTableToolbarProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <div className="relative w-[320px]">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <InputClearable
          placeholder="Filter items..."
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          onClear={() => table.setGlobalFilter('')}
          className="pl-8"
        />
      </div>
      <div className="ml-4 flex items-center space-x-2">
        {table.getColumn('status') && (
          <DataTableFacetedFilterButton
            column={table.getColumn('status')}
            title="Status"
            options={statusOptions}
            renderOption={(option) => (
              <ItemStatusBadge status={option.value as Item['status']} />
            )}
            renderSelected={(option) => (
              <ItemStatusBadge status={option.value as Item['status']} />
            )}
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilterButton
            column={table.getColumn('category')}
            title="Category"
            options={categoryOptions}
          />
        )}
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <FreezeColumnToggleButton
          table={table}
          frozenColumnKeys={frozenColumnKeys}
          setFrozenColumnKeys={setFrozenColumnKeys}
        />
        <DataColumnToggleButton table={table} />
      </div>
    </div>
  );
}
