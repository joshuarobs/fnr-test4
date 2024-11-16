import React, { useState, useCallback } from 'react';
import { Item } from '../item';
import { Input } from '@react-monorepo/shared';
import { PencilIcon } from 'lucide-react';
import { OurQuoteLinkIcon } from '../OurQuoteLinkIcon';

interface OurQuoteCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
}

export const OurQuoteCell = ({ item, updateItem }: OurQuoteCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [value, setValue] = useState(item.ourquote?.toString() ?? '');

  const formatQuote = (quote: number | null) => {
    // Check if quote is exactly 0 (not null)
    if (quote === 0) {
      return '0.00';
    }
    // Check if quote is null or undefined
    if (quote == null) {
      return <div className="text-muted-foreground italic">No quote</div>;
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(quote);
  };

  const handleClick = useCallback(() => {
    setIsEditing(true);
    setIsHovering(false); // Cancel hover state when editing starts
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || /^\d*\.?\d{0,2}$/.test(newValue)) {
      setValue(newValue);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (value === '') {
      updateItem({ ...item, ourquote: null });
    } else {
      const newQuote = parseFloat(value);
      if (!isNaN(newQuote) && newQuote !== item.ourquote) {
        updateItem({ ...item, ourquote: newQuote });
      }
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

  return (
    <div className="flex items-center justify-end w-full">
      {isEditing ? (
        <div className="flex justify-end mr-2">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-24 text-right px-2 py-1"
            pattern="^\d*\.?\d{0,2}$"
          />
        </div>
      ) : (
        <div
          className={`flex items-center mr-2 p-2 rounded cursor-pointer ${
            isHovering ? 'bg-black bg-opacity-10' : ''
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleClick}
        >
          <div className="w-4 mr-1">
            {isHovering ? (
              <PencilIcon size={16} className="text-gray-500" />
            ) : (
              <div className="w-4 h-4" /> // Empty div to maintain space
            )}
          </div>
          <div>{formatQuote(item.ourquote)}</div>
        </div>
      )}
      <OurQuoteLinkIcon quoteLink={item.ourquoteLink || undefined} />
    </div>
  );
};
