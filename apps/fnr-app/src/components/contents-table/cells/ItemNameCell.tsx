import React, { useState, useCallback } from 'react';
import {
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import { Item } from '../item';
import { BrowseLinkButton } from '../BrowseLinkButton';
import cliTruncate from 'cli-truncate';
import { highlightText } from '../utils/highlightText';

interface ItemNameCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
  filterText?: string;
}

export const ItemNameCell = ({
  item,
  updateItem,
  filterText = '',
}: ItemNameCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.name);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (value !== item.name) {
      updateItem({ ...item, name: value });
    }
  }, [value, item, updateItem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur();
      }
    },
    [handleBlur]
  );

  if (isEditing) {
    return (
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full px-2 py-1"
      />
    );
  }

  const truncatedName = cliTruncate(item.name, 25, { position: 'end' });
  const shouldShowTooltip = item.name.length > 25;

  // Ensures long text stays on a single line with ellipsis instead of wrapping to two lines
  const textStyle = {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const renderContent = (text: string) => {
    return filterText ? highlightText(text, filterText) : text;
  };

  return (
    <div className="flex items-center justify-between w-full">
      {shouldShowTooltip ? (
        <TooltipProvider>
          <Tooltip delayDuration={350}>
            <TooltipTrigger asChild>
              <div
                onDoubleClick={handleDoubleClick}
                className="cursor-pointer flex-grow"
                style={textStyle}
              >
                {renderContent(truncatedName)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{renderContent(item.name)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="cursor-pointer flex-grow"
          style={textStyle}
        >
          {renderContent(truncatedName)}
        </div>
      )}
      <div className="flex-shrink-0 ml-4">
        <BrowseLinkButton
          tooltipText="Search for item in Google in a new tab"
          searchText={item.name}
        />
      </div>
    </div>
  );
};
