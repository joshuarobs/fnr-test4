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
import {
  ItemCategory,
  categoryIcons,
  NO_CATEGORY_VALUE,
} from '../itemCategories';

interface CategoryDropdownProps {
  selectedCategory: ItemCategory | null;
  onCategorySelect: (category: ItemCategory | null) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

// Reusable category dropdown component
export const CategoryDropdown = ({
  selectedCategory,
  onCategorySelect,
  onOpenChange,
  defaultOpen,
  className,
}: CategoryDropdownProps) => {
  const [searchText, setSearchText] = useState('');

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleCategorySelect = (value: string) => {
    const newCategory =
      value === NO_CATEGORY_VALUE ? null : (value as ItemCategory);
    onCategorySelect(newCategory);
  };

  const filteredCategories = Object.values(ItemCategory).filter((category) =>
    category.toLowerCase().includes(searchText.toLowerCase())
  );

  const Icon = selectedCategory ? categoryIcons[selectedCategory] : null;

  return (
    <Select
      value={selectedCategory === null ? NO_CATEGORY_VALUE : selectedCategory}
      onValueChange={handleCategorySelect}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedCategory === null ? (
            <div className="text-muted-foreground italic">No category</div>
          ) : (
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4 text-gray-600" />}
              <span>{selectedCategory}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="p-1">
          <InputClearable
            placeholder="Filter categories..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => setSearchText('')}
            className="h-8"
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <ScrollArea className="h-[200px]">
          <SelectItem
            value={NO_CATEGORY_VALUE}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-muted-foreground italic">
              No category
            </div>
          </SelectItem>
          <Separator className="my-2" />
          {filteredCategories.map((category) => {
            const CategoryIcon = categoryIcons[category as ItemCategory];
            return (
              <SelectItem
                key={category}
                value={category}
                className="hover:cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-4 w-4 text-gray-600" />
                  <span>{category}</span>
                </div>
              </SelectItem>
            );
          })}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};
