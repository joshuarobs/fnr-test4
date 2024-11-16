import React from 'react';
import { Item } from '../item';
import { OurQuoteLinkIcon } from '../OurQuoteLinkIcon';
import { EditableInputField } from '../EditableInputField';

interface OurQuoteCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
}

export const OurQuoteCell = ({ item, updateItem }: OurQuoteCellProps) => {
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

  const validateInput = (value: string) => {
    return value === '' || /^\d*\.?\d{0,2}$/.test(value);
  };

  const handleSave = (value: string) => {
    if (value === '') {
      updateItem({ ...item, ourquote: null });
    } else {
      const newQuote = parseFloat(value);
      if (!isNaN(newQuote) && newQuote !== item.ourquote) {
        updateItem({ ...item, ourquote: newQuote });
      }
    }
  };

  return (
    <div className="flex items-center justify-end w-full">
      <EditableInputField
        initialValue={item.ourquote?.toString() ?? ''}
        onSave={handleSave}
        formatDisplay={(value) =>
          formatQuote(value === '' ? null : parseFloat(value))
        }
        validate={validateInput}
        inputClassName="w-24"
        iconPosition="left"
      />
      <OurQuoteLinkIcon quoteLink={item.ourquoteLink || undefined} />
    </div>
  );
};
