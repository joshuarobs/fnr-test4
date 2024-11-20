import React, { useState, useCallback } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import { Item } from '../item';
import { ItemCategory, categoryIcons } from '../itemCategories';
import cliTruncate from 'cli-truncate';
import { highlightText } from '../utils/highlightText';
import { CategoryDropdown } from '../shared/CategoryDropdown';

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

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCategorySelect = useCallback(
    (newCategory: ItemCategory | null) => {
      setIsEditing(false);
      if (newCategory !== item.category) {
        updateItem({ ...item, category: newCategory });
      }
    },
    [item, updateItem]
  );

  if (isEditing) {
    return (
      <div className="relative">
        <CategoryDropdown
          selectedCategory={item.category}
          onCategorySelect={handleCategorySelect}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
            }
          }}
          defaultOpen
          className="w-full"
        />
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
        <Icon className="h-4 w-4 flex-shrink-0 text-gray-600" />
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
