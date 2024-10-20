import React, { useState, useCallback } from 'react';
import { Input } from '@react-monorepo/shared';
import { Item } from './item';
import { BrowseLinkButton } from './BrowseLinkButton';

interface ItemNameCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
}

export const ItemNameCell = ({ item, updateItem }: ItemNameCellProps) => {
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

  return (
    <div className="flex items-center justify-between w-full">
      <div
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer flex-grow truncate"
      >
        {item.name}
      </div>
      <div className="flex-shrink-0 ml-4 mr-2">
        <BrowseLinkButton
          tooltipText="Search for item in Google in a new tab"
          searchText={item.name}
        />
      </div>
    </div>
  );
};
