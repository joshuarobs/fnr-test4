import React from 'react';
import {
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
import { EditableInputField } from '../EditableInputField';

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

const getPastelColorFromId = (id: number): string => {
  // Generates a random enough colour based on the id
  // This is so users don't see distracting patterns on claims that don't have any images on it
  // Combine multiple trigonometric functions with different frequencies and phases
  const x = id * 0.7; // Base frequency
  const chaos =
    Math.abs(
      Math.sin(x) * Math.cos(x * 1.3) +
        Math.sin(x * 2.4) * Math.cos(x * 0.6) +
        Math.sin(x * 3.7)
    ) * 10000;

  const index = Math.floor(chaos % pastelColors.length);
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
  const truncatedName = cliTruncate(item.name, 25, { position: 'end' });
  const shouldShowTooltip = item.name.length > 25;

  const handleSave = (newValue: string) => {
    if (newValue !== item.name) {
      updateItem({ ...item, name: newValue });
    }
  };

  const formatDisplay = (text: string) => {
    const displayText = shouldShowTooltip ? truncatedName : text;
    return filterText ? highlightText(displayText, filterText) : displayText;
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
          color={getPastelColorFromId(item.id)}
        />
      </div>
    );
  };

  const content = (
    <div className="flex items-center flex-grow min-w-0">
      {renderImageIcon()}
      <EditableInputField
        initialValue={item.name}
        onSave={handleSave}
        formatDisplay={formatDisplay}
        iconPosition="right"
      />
    </div>
  );

  return (
    <div className="flex items-center justify-between w-full">
      {shouldShowTooltip ? (
        <TooltipProvider>
          <Tooltip delayDuration={350}>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent>
              <p>
                {filterText ? highlightText(item.name, filterText) : item.name}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        content
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
