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
  Button,
} from '@react-monorepo/shared';
import { Item } from '../item';
import {
  ItemCategory,
  categoryIcons,
  NO_CATEGORY_VALUE,
} from '../itemCategories';
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
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(
    item.category
  );
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCategorySelect = useCallback(
    (value: string) => {
      const newCategory =
        value === NO_CATEGORY_VALUE ? null : (value as ItemCategory);
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
          value={
            selectedCategory === null ? NO_CATEGORY_VALUE : selectedCategory
          }
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
              <SelectItem value={NO_CATEGORY_VALUE}>
                <div className="flex items-center gap-2 text-muted-foreground italic">
                  No category
                </div>
              </SelectItem>
              {filteredCategories.map((category) => {
                const Icon = categoryIcons[category as ItemCategory];
                return (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{category}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Handle null category
  if (item.category === null) {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer flex-grow text-muted-foreground italic"
      >
        No category
      </div>
    );
  }

  const truncatedCategory = cliTruncate(item.category, 25, { position: 'end' });
  const shouldShowTooltip = item.category.length > 25;
  const Icon = categoryIcons[item.category];

  const textStyle = {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const renderContent = (text: string) => {
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{filterText ? highlightText(text, filterText) : text}</span>
      </div>
    );
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
