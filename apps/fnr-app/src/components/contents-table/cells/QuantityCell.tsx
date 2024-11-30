import React from 'react';
import { Item } from '../item';
import { EditableInputField } from '../EditableInputField';
import { ITEM_KEYS } from '../itemKeys';

interface QuantityCellProps {
  item: Item;
  claimNumber: string;
  updateItem: (updatedItem: Item, claimNumber: string) => void;
}

// Component for editing item quantity with validation for whole numbers
export const QuantityCell = ({
  item,
  claimNumber,
  updateItem,
}: QuantityCellProps) => {
  const quantity = item[ITEM_KEYS.QUANTITY] as number;

  // Only allow whole numbers
  const validateInput = (value: string) => {
    return value === '' || /^\d+$/.test(value);
  };

  const handleSave = (value: string) => {
    if (value === '') {
      updateItem({ ...item, [ITEM_KEYS.QUANTITY]: 0 }, claimNumber);
    } else {
      const newQuantity = parseInt(value, 10);
      if (!isNaN(newQuantity) && newQuantity !== quantity) {
        updateItem({ ...item, [ITEM_KEYS.QUANTITY]: newQuantity }, claimNumber);
      }
    }
  };

  return (
    <div className="flex items-center justify-end w-full">
      <EditableInputField
        initialValue={quantity?.toString() ?? '0'}
        onSave={handleSave}
        formatDisplay={(value) => value}
        validate={validateInput}
        inputClassName="w-20"
        textAlign="right"
        iconPosition="left"
      />
    </div>
  );
};
