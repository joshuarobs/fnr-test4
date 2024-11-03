import React from 'react';
import { Search } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { InputClearable, Button } from '@react-monorepo/shared';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import { DataColumnToggleButton } from './DataColumnToggleButton';
import { FreezeColumnToggleButton } from './FreezeColumnToggleButton';
import { Item } from '../item';
import { DataTableFacetedFilterButton } from './DataTableFacetedFilterButton';
import { ItemCategory } from '../itemCategories';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { ItemStatus } from '../ItemStatus';
import { ITEM_KEYS } from '../itemKeys';

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

const insuredQuoteOptions = [
  { label: 'Has value', value: 'has-value' },
  { label: 'Empty', value: 'empty' },
];

export function ContentsTableToolbar<TData extends Item>({
  table,
  frozenColumnKeys,
  setFrozenColumnKeys,
}: ContentsTableToolbarProps<TData>) {
  const hasActiveFilters = table
    .getAllColumns()
    .some((column) => column.getFilterValue() != null);

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
        {table.getColumn(ITEM_KEYS.STATUS) && (
          <DataTableFacetedFilterButton
            column={table.getColumn(ITEM_KEYS.STATUS)}
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
        {table.getColumn(ITEM_KEYS.CATEGORY) && (
          <DataTableFacetedFilterButton
            column={table.getColumn(ITEM_KEYS.CATEGORY)}
            title="Category"
            options={categoryOptions}
          />
        )}
        {table.getColumn(ITEM_KEYS.OIS_QUOTE) && (
          <DataTableFacetedFilterButton
            column={table.getColumn(ITEM_KEYS.OIS_QUOTE)}
            title="Insured's Quote"
            options={insuredQuoteOptions}
            alwaysShowOptions={true}
          />
        )}
        {hasActiveFilters && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-sm underline"
                  onClick={() => {
                    table.getAllColumns().forEach((column) => {
                      if (column.getCanFilter()) {
                        column.setFilterValue(undefined);
                      }
                    });
                  }}
                >
                  Clear all
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center" side="top" sideOffset={5}>
                <p>Clears all filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
