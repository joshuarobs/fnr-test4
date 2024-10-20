import React, { useState, useCallback } from 'react';
import { Item } from './item';
import { Input } from '@react-monorepo/shared';

interface OurQuoteCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
}

export const OurQuoteCell = ({ item, updateItem }: OurQuoteCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.ourquote.toString());

  const formatQuote = (quote: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(quote);
  };

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || /^\d*\.?\d{0,2}$/.test(newValue)) {
      setValue(newValue);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    const newQuote = parseFloat(value);
    if (!isNaN(newQuote) && newQuote !== item.ourquote) {
      updateItem({ ...item, ourquote: newQuote });
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
      <div className="flex justify-end">
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
    );
  }

  return (
    <div className="text-right" onDoubleClick={handleDoubleClick}>
      {formatQuote(item.ourquote)}
    </div>
  );
};
