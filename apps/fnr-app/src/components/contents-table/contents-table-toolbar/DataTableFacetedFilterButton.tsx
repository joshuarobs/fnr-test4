import * as React from 'react';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import { cn } from '../../../../../../shared/src/lib/utils';
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  InputClearable,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator,
} from '@react-monorepo/shared';
import { FilterOption, OptionGroups } from './types';

interface DataTableFacetedFilterButtonProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: OptionGroups;
  renderOption?: (option: FilterOption) => React.ReactNode;
  renderSelected?: (option: FilterOption) => React.ReactNode;
  alwaysShowOptions?: boolean;
  disableFilterInput?: boolean;
}

const FilterBadge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Badge
    variant="secondary"
    className={cn(
      'rounded-full px-2 py-0.5 text-xs font-medium bg-gray-200',
      className
    )}
  >
    {children}
  </Badge>
);

const HIDE_EMPTY_FILTERS = true;

export function DataTableFacetedFilterButton<TData, TValue>({
  column,
  title,
  options,
  renderOption,
  renderSelected,
  alwaysShowOptions = false,
  disableFilterInput = false,
}: DataTableFacetedFilterButtonProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(
    column?.getFilterValue() as Array<string | null>
  );
  const [filterValue, setFilterValue] = React.useState('');

  const getOptionCount = (option: FilterOption) => {
    if (option.getCount) {
      return option.getCount(facets!);
    }
    return facets?.get(option.value) ?? 0;
  };

  const filterOption = (option: FilterOption) => {
    const count = getOptionCount(option);
    return (
      (alwaysShowOptions || !HIDE_EMPTY_FILTERS || count > 0) &&
      (!filterValue ||
        option.label.toLowerCase().includes(filterValue.toLowerCase()))
    );
  };

  const renderOptionItem = (option: FilterOption) => {
    const isSelected = selectedValues.has(option.value);
    const count = getOptionCount(option);

    return (
      <CommandItem
        key={option.value?.toString() ?? 'null'}
        onSelect={() => {
          if (isSelected) {
            selectedValues.delete(option.value);
          } else {
            selectedValues.add(option.value);
          }
          const filterValues = Array.from(selectedValues);
          column?.setFilterValue(
            filterValues.length ? filterValues : undefined
          );
        }}
        className="cursor-pointer"
      >
        <div
          className={cn(
            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'opacity-50 [&_svg]:invisible'
          )}
        >
          <CheckIcon className={cn('h-4 w-4')} />
        </div>
        {option.icon && (
          <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
        )}
        <span className="flex-1 truncate">
          {renderOption ? renderOption(option) : option.label}
        </span>
        {count > 0 && (
          <FilterBadge className="ml-auto min-w-[20px] text-center">
            {count}
          </FilterBadge>
        )}
      </CommandItem>
    );
  };

  const allOptions = [
    ...(options.headerGroup || []),
    ...options.mainGroup,
    ...(options.footerGroup || []),
  ] as FilterOption[];

  const filteredHeaderOptions = (options.headerGroup?.filter(filterOption) ||
    []) as FilterOption[];
  const filteredMainOptions = options.mainGroup.filter(
    filterOption
  ) as FilterOption[];
  const filteredFooterOptions = (options.footerGroup?.filter(filterOption) ||
    []) as FilterOption[];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          <span className="text-sm select-none">{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <FilterBadge className="lg:hidden">
                {selectedValues.size}
              </FilterBadge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <FilterBadge>{selectedValues.size} selected</FilterBadge>
                ) : (
                  allOptions
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <div key={option.value?.toString() ?? 'null'}>
                        {renderSelected ? (
                          renderSelected(option)
                        ) : (
                          <FilterBadge>{option.label}</FilterBadge>
                        )}
                      </div>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          {!disableFilterInput && (
            <div className="px-2 py-2">
              <InputClearable
                placeholder={`Filter ${title?.toLowerCase()}...`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                onClear={() => setFilterValue('')}
                className="h-8"
              />
            </div>
          )}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea
              className="overflow-y-auto"
              style={{ maxHeight: '200px' }}
            >
              {filteredHeaderOptions.length > 0 && (
                <>
                  <CommandGroup>
                    {filteredHeaderOptions.map(renderOptionItem)}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {filteredMainOptions.length > 0 && (
                <CommandGroup>
                  {filteredMainOptions.map(renderOptionItem)}
                </CommandGroup>
              )}

              {filteredFooterOptions.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    {filteredFooterOptions.map(renderOptionItem)}
                  </CommandGroup>
                </>
              )}
            </ScrollArea>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center underline cursor-pointer"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
