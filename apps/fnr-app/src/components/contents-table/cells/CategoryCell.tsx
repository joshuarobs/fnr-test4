import React, { useState, useCallback, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  InputClearable,
  ScrollArea,
} from '@react-monorepo/shared';
import { Item } from '../item';
import { ItemCategory } from '../itemCategories';
import cliTruncate from 'cli-truncate';
import { highlightText } from '../utils/highlightText';

interface CategoryCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
  filterText?: string;
}

export const CategoryCell = ({
  item,
  updateItem,
  filterText = '',
}: CategoryCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>(
    item.category
  );
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCategorySelect = useCallback(
    (newCategory: ItemCategory) => {
      setSelectedCategory(newCategory);
      setIsEditing(false);
      if (newCategory !== item.category) {
        updateItem({ ...item, category: newCategory });
      }
    },
    [item, updateItem]
  );

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  const filteredCategories = Object.values(ItemCategory).filter((category) =>
    category.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="relative">
        <Select
          value={selectedCategory}
          onValueChange={handleCategorySelect}
          defaultOpen
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
              setSearchText('');
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-1">
              <InputClearable
                ref={inputRef}
                placeholder="Filter categories..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClear={() => setSearchText('')}
                className="h-8"
                autoFocus
                onKeyDown={handleInputKeyDown}
              />
            </div>
            <ScrollArea className="h-[200px]">
              {filteredCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    );
  }

  const truncatedCategory = cliTruncate(item.category, 25, { position: 'end' });
  const shouldShowTooltip = item.category.length > 25;

  const textStyle = {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const renderContent = (text: string) => {
    return filterText ? highlightText(text, filterText) : text;
  };

  return (
    <div className="flex items-center w-full">
      {shouldShowTooltip ? (
        <TooltipProvider>
          <Tooltip delayDuration={350}>
            <TooltipTrigger asChild>
              <div
                onDoubleClick={handleDoubleClick}
                className="cursor-pointer flex-grow"
                style={textStyle}
              >
                {renderContent(truncatedCategory)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{renderContent(item.category)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="cursor-pointer flex-grow"
          style={textStyle}
        >
          {renderContent(truncatedCategory)}
        </div>
      )}
    </div>
  );
};
