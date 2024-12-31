import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
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
  showChevron?: boolean;
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
  showChevron = false,
}: FilterableDropdownProps<T>) => {
  const [searchText, setSearchText] = useState('');

  const filteredValues = values.filter((value) =>
    getFilterText(value).toLowerCase().includes(searchText.toLowerCase())
  );

  const [open, setOpen] = useState(defaultOpen || false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSelect = (value: T | null) => {
    onValueSelect(value);
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`justify-start ${className || ''}`}
        >
          <div className="flex items-center justify-between w-full">
            {renderTriggerContent(selectedValue)}
            {showChevron && (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
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
                  onSelect={() => handleSelect(null)}
                  className="cursor-pointer justify-start"
                >
                  <div className="flex-1">{renderNoValueContent()}</div>
                </CommandItem>
                <Separator className="my-1" />
                {filteredValues.map((value) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={() => handleSelect(value)}
                    className="cursor-pointer justify-start"
                  >
                    <div className="flex-1">{renderItemContent(value)}</div>
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
