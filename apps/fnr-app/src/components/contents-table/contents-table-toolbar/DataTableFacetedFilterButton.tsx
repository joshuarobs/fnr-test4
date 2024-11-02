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
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator,
} from '@react-monorepo/shared';

interface DataTableFacetedFilterButtonProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  renderOption?: (option: { label: string; value: string }) => React.ReactNode;
  renderSelected?: (option: {
    label: string;
    value: string;
  }) => React.ReactNode;
}

// Controls whether to show/hide empty filters that if selected will show no results
const HIDE_EMPTY_FILTERS = true;

export function DataTableFacetedFilterButton<TData, TValue>({
  column,
  title,
  options,
  renderOption,
  renderSelected,
}: DataTableFacetedFilterButtonProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          <span className="text-sm select-none">{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0.5 text-xs font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2 py-0.5 text-xs font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <div key={option.value}>
                        {renderSelected ? (
                          renderSelected(option)
                        ) : (
                          <Badge
                            variant="secondary"
                            className="rounded-full px-2 py-0.5 text-xs font-normal"
                          >
                            {option.label}
                          </Badge>
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
          <CommandInput placeholder={`Filter ${title?.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea
                className="overflow-y-auto"
                style={{ maxHeight: '200px' }}
              >
                {options
                  .filter((option) => {
                    const count = facets?.get(option.value) ?? 0;
                    return !HIDE_EMPTY_FILTERS || count > 0;
                  })
                  .map((option) => {
                    const isSelected = selectedValues.has(option.value);
                    const count = facets?.get(option.value) ?? 0;
                    return (
                      <CommandItem
                        key={option.value}
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
                        <span className="flex-1">
                          {renderOption ? renderOption(option) : option.label}
                        </span>
                        {count > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-auto rounded-full px-2 py-0.5 text-xs min-w-[20px] text-center"
                          >
                            {count}
                          </Badge>
                        )}
                      </CommandItem>
                    );
                  })}
              </ScrollArea>
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center text-red-500"
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
