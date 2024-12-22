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

// Array of Tailwind background color classes with dark mode variants
const pastelColors = [
  'bg-gray-300 dark:bg-gray-600',
  'bg-red-300 dark:bg-red-600',
  'bg-orange-300 dark:bg-orange-600',
  'bg-amber-300 dark:bg-amber-600',
  'bg-yellow-300 dark:bg-yellow-600',
  'bg-lime-300 dark:bg-lime-600',
  'bg-green-300 dark:bg-green-600',
  'bg-emerald-300 dark:bg-emerald-600',
  'bg-cyan-300 dark:bg-cyan-600',
  'bg-sky-300 dark:bg-sky-600',
  'bg-blue-300 dark:bg-blue-600',
  'bg-indigo-300 dark:bg-indigo-600',
  'bg-violet-300 dark:bg-violet-600',
  'bg-purple-300 dark:bg-purple-600',
  'bg-fuchsia-300 dark:bg-fuchsia-600',
  'bg-pink-300 dark:bg-pink-600',
  'bg-rose-300 dark:bg-rose-600',
] as const;

const getPastelColorFromId = (id: number): string => {
  const x = id * 0.7;
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
  rowData: any; // This will be the row data from PrimeReact table
  updateItem?: (updatedItem: Item) => void;
  filterText?: string;
}

export const ItemNameCell = ({
  rowData,
  updateItem,
  filterText = '',
}: ItemNameCellProps) => {
  // Convert PrimeReact row data to Item type
  const item: Item = {
    id: rowData.id,
    name: rowData.name,
    itemStatus: rowData.status,
    roomCategory: rowData.room,
    category: rowData.category,
    modelSerialNumber: rowData.modelSerial,
    quantity: rowData.quantity,
    insuredsQuote: rowData.insuredQuote,
    ourQuote: rowData.ourQuote,
    localId: rowData.id,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    dateCreated: new Date(), // Using current date as fallback
  };

  const truncatedName = cliTruncate(item.name, 25, { position: 'end' });
  const shouldShowTooltip = item.name.length > 25;

  const handleSave = (newValue: string) => {
    if (newValue !== item.name && updateItem) {
      updateItem({ ...item, name: newValue });
    }
  };

  const formatDisplay = (text: string) => {
    const displayText = shouldShowTooltip ? truncatedName : text;
    return filterText ? highlightText(displayText, filterText) : displayText;
  };

  const renderImageIcon = () => {
    return (
      <div className="mr-2 flex-shrink-0">
        <PlaceholderImageGeneric
          itemCategory={item.category || undefined}
          color={getPastelColorFromId(item.id)}
        />
      </div>
    );
  };

  const content = (
    <div className="flex items-center w-full min-w-0">
      {renderImageIcon()}
      <div className="flex-grow min-w-0">
        <EditableInputField
          initialValue={item.name}
          onSave={handleSave}
          formatDisplay={formatDisplay}
          iconPosition="right"
        />
      </div>
      <div className="flex-shrink-0 ml-4">
        <BrowseLinkButton
          tooltipText="Search for item in Google in a new tab"
          searchText={item.name}
        />
      </div>
    </div>
  );

  return shouldShowTooltip ? (
    <TooltipProvider>
      <Tooltip delayDuration={350}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>{filterText ? highlightText(item.name, filterText) : item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    content
  );
};
