import React from 'react';
import { Search } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { InputClearable, Button, colors, Badge } from '@react-monorepo/shared';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
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
import { ItemCategory, NO_CATEGORY_VALUE } from '../itemCategories';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { ItemStatus } from '../ItemStatus';
import { ITEM_KEYS } from '../itemKeys';
import { OptionGroups, FilterOption } from './types';

interface ContentsTableToolbarProps<TData> {
  table: Table<TData>;
  frozenColumnKeys: (keyof Item)[];
  setFrozenColumnKeys: React.Dispatch<React.SetStateAction<(keyof Item)[]>>;
}

const statusOptions: OptionGroups = {
  mainGroup: [
    { label: 'Not Repairable', value: ItemStatus.NR },
    { label: 'Replacement Same', value: ItemStatus.RS },
    { label: 'VPOL', value: ItemStatus.VPOL },
  ],
};

const categoryOptions: OptionGroups = {
  headerGroup: [{ label: 'No category', value: null }],
  mainGroup: Object.values(ItemCategory).map((category) => ({
    label: category,
    value: category,
  })),
};

const insuredQuoteOptions: OptionGroups = {
  mainGroup: [
    { label: 'Empty', value: null },
    {
      label: 'Has value',
      value: 'has-value',
      getCount: (facets: Map<string | number | null, number>) => {
        let count = 0;
        facets.forEach((value: number, key: string | number | null) => {
          if (key !== null && key !== undefined) {
            count += value;
          }
        });
        return count;
      },
    },
  ],
};

const differenceOptions: OptionGroups = {
  mainGroup: [
    { label: 'Higher', value: 'higher' },
    { label: 'Lower', value: 'lower' },
    { label: 'Same', value: 'same' },
    { label: 'N/A', value: 'na' },
  ],
};

const renderDifferenceOption = (option: FilterOption) => {
  if (option.value === 'higher') {
    return (
      <div className={`flex items-center gap-2 ${colors.status.error}`}>
        <CaretUpOutlined className={colors.status.error} />
        Higher
      </div>
    );
  }
  if (option.value === 'lower') {
    return (
      <div className={`flex items-center gap-2 ${colors.status.success}`}>
        <CaretDownOutlined className={colors.status.success} />
        Lower
      </div>
    );
  }
  return option.label;
};

const renderSelectedDifference = (option: FilterOption) => {
  if (option.value === 'higher') {
    return (
      <Badge
        className={`bg-red-100 text-red-700 border-red-200 hover:bg-red-100`}
      >
        <div className="flex items-center gap-1">
          <CaretUpOutlined />
          Higher
        </div>
      </Badge>
    );
  }
  if (option.value === 'lower') {
    return (
      <Badge
        className={`bg-green-100 text-green-700 border-green-200 hover:bg-green-100`}
      >
        <div className="flex items-center gap-1">
          <CaretDownOutlined />
          Lower
        </div>
      </Badge>
    );
  }
  return <Badge variant="secondary">{option.label}</Badge>;
};

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
      <div className="relative w-[320px] flex-none">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <InputClearable
          placeholder="Filter items..."
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          onClear={() => table.setGlobalFilter('')}
          className="pl-8"
        />
      </div>
      <div className="ml-4 flex-1 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          {table.getColumn(ITEM_KEYS.STATUS) && (
            <DataTableFacetedFilterButton
              column={table.getColumn(ITEM_KEYS.STATUS) as any}
              title="Status"
              options={statusOptions}
              disableFilterInput
              renderOption={(option) => (
                <ItemStatusBadge
                  status={option.value as Item['status']}
                  showTooltip={false}
                />
              )}
              renderSelected={(option) => (
                <ItemStatusBadge
                  status={option.value as Item['status']}
                  showTooltip={false}
                />
              )}
            />
          )}
          {table.getColumn(ITEM_KEYS.CATEGORY) && (
            <DataTableFacetedFilterButton
              column={table.getColumn(ITEM_KEYS.CATEGORY) as any}
              title="Category"
              options={categoryOptions}
            />
          )}
          {table.getColumn(ITEM_KEYS.OIS_QUOTE) && (
            <DataTableFacetedFilterButton
              column={table.getColumn(ITEM_KEYS.OIS_QUOTE) as any}
              title="Insured's Quote"
              options={insuredQuoteOptions}
              alwaysShowOptions={true}
              disableFilterInput
            />
          )}
          {table.getColumn(ITEM_KEYS.DIFFERENCE) && (
            <DataTableFacetedFilterButton
              column={table.getColumn(ITEM_KEYS.DIFFERENCE) as any}
              title="Difference"
              options={differenceOptions}
              alwaysShowOptions={true}
              disableFilterInput
              renderOption={renderDifferenceOption}
              renderSelected={renderSelectedDifference}
            />
          )}
          {table.getColumn(ITEM_KEYS.OUR_QUOTE) && (
            <DataTableFacetedFilterButton
              column={table.getColumn(ITEM_KEYS.OUR_QUOTE) as any}
              title="Our Quote"
              options={insuredQuoteOptions}
              alwaysShowOptions={true}
              disableFilterInput
            />
          )}
        </div>
      </div>
      {hasActiveFilters && (
        <div className="ml-4 flex-none">
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
        </div>
      )}
      <div className="ml-4 flex-none flex items-center space-x-2">
        <FreezeColumnToggleButton
          table={table as unknown as Table<Item>}
          frozenColumnKeys={frozenColumnKeys}
          setFrozenColumnKeys={setFrozenColumnKeys}
        />
        <DataColumnToggleButton table={table} />
      </div>
    </div>
  );
}
