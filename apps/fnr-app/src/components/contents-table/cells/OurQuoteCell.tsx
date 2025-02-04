import React from 'react';
import { Item } from '../item';
import { OurQuoteLinkIcon } from '../OurQuoteLinkIcon';
import { EditableInputField } from '../EditableInputField';
import { formatQuote, styles, validateQuoteInput } from './tableCellsStyles';

interface OurQuoteCellProps {
  item: Item;
  claimNumber: string;
  updateItem: (updatedItem: Item, claimNumber: string) => void;
}

export const OurQuoteCell = ({
  item,
  claimNumber,
  updateItem,
}: OurQuoteCellProps) => {
  const handleSave = (value: string) => {
    if (value === '') {
      updateItem({ ...item, ourQuote: null }, claimNumber);
    } else {
      const newQuote = parseFloat(value);
      if (!isNaN(newQuote) && newQuote !== item.ourQuote) {
        updateItem({ ...item, ourQuote: newQuote }, claimNumber);
      }
    }
  };

  const handleQuoteProofSave = (url: string) => {
    updateItem({ ...item, ourQuoteProof: url }, claimNumber);
  };

  return (
    <div className={styles.container}>
      <EditableInputField
        initialValue={item.ourQuote?.toString() ?? ''}
        onSave={handleSave}
        formatDisplay={(value) =>
          formatQuote(value === '' ? null : parseFloat(value), item.quantity)
        }
        validate={validateQuoteInput}
        inputClassName={styles.inputField}
        iconPosition="left"
        textAlign="right"
      />
      <OurQuoteLinkIcon
        ourQuoteProof={item.ourQuoteProof || undefined}
        onSave={handleQuoteProofSave}
      />
    </div>
  );
};
