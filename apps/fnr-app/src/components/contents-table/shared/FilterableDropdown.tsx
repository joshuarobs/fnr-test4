import { useState } from 'react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  InputClearable,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator,
} from '@react-monorepo/shared';
interface FilterableDropdownProps<T> {
  selectedValue: T | null;
  onValueSelect: (value: T | null) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
  values: T[];
  noValueOption: string;
  filterPlaceholder?: string;
  renderTriggerContent: (value: T | null) => React.ReactNode;
  renderItemContent: (value: T) => React.ReactNode;
  renderNoValueContent: () => React.ReactNode;
  getFilterText: (value: T) => string;
}

// Generic filterable dropdown component that can be used for both item and room categories
export const FilterableDropdown = <T extends string>({
  selectedValue,
  onValueSelect,
  onOpenChange,
  defaultOpen,
  className,
  values,
  noValueOption,
  filterPlaceholder = 'Filter...',
  renderTriggerContent,
  renderItemContent,
  renderNoValueContent,
  getFilterText,
}: FilterableDropdownProps<T>) => {
  const [searchText, setSearchText] = useState('');

  const filteredValues = values.filter((value) =>
    getFilterText(value).toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Popover defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`justify-start ${className || ''}`}
        >
          {renderTriggerContent(selectedValue)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <div className="p-2">
            <InputClearable
              placeholder={filterPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClear={() => setSearchText('')}
              className="h-8"
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea className="h-[200px]">
              <CommandGroup>
                <CommandItem
                  value={noValueOption}
                  onSelect={() => onValueSelect(null)}
                  className="cursor-pointer justify-start"
                >
                  {renderNoValueContent()}
                </CommandItem>
                <Separator className="my-1" />
                {filteredValues.map((value) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={() => onValueSelect(value)}
                    className="cursor-pointer justify-start"
                  >
                    {renderItemContent(value)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
