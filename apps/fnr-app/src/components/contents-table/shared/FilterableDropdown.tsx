import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  InputClearable,
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

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleValueSelect = (value: string) => {
    const newValue = value === noValueOption ? null : (value as T);
    onValueSelect(newValue);
  };

  const filteredValues = values.filter((value) =>
    getFilterText(value).toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Select
      value={selectedValue === null ? noValueOption : selectedValue}
      onValueChange={handleValueSelect}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger className={className}>
        <SelectValue>{renderTriggerContent(selectedValue)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="p-1">
          <InputClearable
            placeholder={filterPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => setSearchText('')}
            className="h-8"
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <ScrollArea className="h-[200px]">
          <SelectItem value={noValueOption} className="hover:cursor-pointer">
            {renderNoValueContent()}
          </SelectItem>
          <Separator className="my-2" />
          {filteredValues.map((value) => (
            <SelectItem
              key={value}
              value={value}
              className="hover:cursor-pointer"
            >
              {renderItemContent(value)}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};
