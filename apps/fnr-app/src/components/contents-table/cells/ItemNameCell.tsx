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
import { PlaceholderImageGeneric } from '../../placeholder-images/PlaceholderImageGeneric';

// Array of complete Tailwind background color classes
const pastelColors = [
  'bg-gray-300',
  'bg-red-300',
  'bg-orange-300',
  'bg-amber-300',
  'bg-yellow-300',
  'bg-lime-300',
  'bg-green-300',
  'bg-emerald-300',
  'bg-cyan-300',
  'bg-sky-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-violet-300',
  'bg-purple-300',
  'bg-fuchsia-300',
  'bg-pink-300',
  'bg-rose-300',
] as const;

const getPastelColorFromTimestamp = (date: Date): string => {
  // Use hours + minutes + seconds as a seed for random color selection
  const seed = date.getHours() + date.getMinutes() + date.getSeconds();
  const index = seed % pastelColors.length;
  return pastelColors[index];
};

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

  const renderImageIcon = () => {
    if (item.ourquoteLink) {
      return (
        <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0 mr-2">
          <img
            src={item.ourquoteLink}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <div className="mr-2">
        <PlaceholderImageGeneric
          itemCategory={item.category || undefined}
          color={getPastelColorFromTimestamp(item.dateCreated)}
        />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center flex-grow min-w-0">
        {renderImageIcon()}
        {shouldShowTooltip ? (
          <TooltipProvider>
            <Tooltip delayDuration={350}>
              <TooltipTrigger asChild>
                <div
                  onDoubleClick={handleDoubleClick}
                  className="cursor-pointer flex-grow min-w-0"
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
            className="cursor-pointer flex-grow min-w-0"
            style={textStyle}
          >
            {renderContent(truncatedName)}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 ml-4">
        <BrowseLinkButton
          tooltipText="Search for item in Google in a new tab"
          searchText={item.name}
        />
      </div>
    </div>
  );
};
