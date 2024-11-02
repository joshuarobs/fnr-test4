import React, { useState, useCallback } from 'react';
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
  const [value, setValue] = useState<ItemCategory>(item.category);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleChange = useCallback(
    (newValue: ItemCategory) => {
      setValue(newValue);
      setIsEditing(false);
      if (newValue !== item.category) {
        updateItem({ ...item, category: newValue });
      }
    },
    [item, updateItem]
  );

  if (isEditing) {
    return (
      <Select
        value={value}
        onValueChange={handleChange}
        defaultOpen
        onOpenChange={(open) => !open && setIsEditing(false)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ItemCategory).map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
