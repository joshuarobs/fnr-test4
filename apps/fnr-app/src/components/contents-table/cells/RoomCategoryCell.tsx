import React, { useState, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@react-monorepo/shared';
import { Item } from '../item';
import {
  RoomCategory,
  roomCategoryDisplayNames,
  NO_ROOM_CATEGORY_VALUE,
} from '../roomCategories';
import { RoomCategoryBadge } from '../RoomCategoryBadge';

interface RoomCategoryCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
}

// Component for selecting room category with a dropdown
export const RoomCategoryDropdown = ({
  selectedCategory,
  onCategorySelect,
  onOpenChange,
  defaultOpen = false,
  className = '',
}: {
  selectedCategory: RoomCategory | null;
  onCategorySelect: (category: RoomCategory) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}) => {
  console.log('RoomCategoryDropdown - selectedCategory:', selectedCategory);

  return (
    <Select
      defaultOpen={defaultOpen}
      onValueChange={onCategorySelect}
      value={selectedCategory || NO_ROOM_CATEGORY_VALUE}
      defaultValue={selectedCategory || NO_ROOM_CATEGORY_VALUE}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedCategory ? (
            <RoomCategoryBadge
              roomCategory={selectedCategory}
              showTooltip={false}
            />
          ) : (
            <span className="text-gray-500">Select room...</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.values(RoomCategory).map((category) => (
          <SelectItem
            key={category}
            value={category}
            className="hover:cursor-pointer"
          >
            <RoomCategoryBadge roomCategory={category} showTooltip={false} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Main RoomCategoryCell component
export const RoomCategoryCell = ({
  item,
  updateItem,
}: RoomCategoryCellProps) => {
  console.log('RoomCategoryCell - item:', item);
  console.log('RoomCategoryCell - roomCategory:', item.roomCategory);

  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCategorySelect = useCallback(
    (newCategory: RoomCategory) => {
      console.log('handleCategorySelect - newCategory:', newCategory);
      setIsEditing(false);
      if (newCategory !== item.roomCategory) {
        updateItem({ ...item, roomCategory: newCategory });
      }
    },
    [item, updateItem]
  );

  if (isEditing) {
    return (
      <div className="relative">
        <RoomCategoryDropdown
          selectedCategory={item.roomCategory}
          onCategorySelect={handleCategorySelect}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
            }
          }}
          defaultOpen
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer flex-grow h-full flex items-center px-2 hover:bg-gray-50"
    >
      {item.roomCategory ? (
        <RoomCategoryBadge roomCategory={item.roomCategory} />
      ) : (
        <span className="text-gray-500">Select room...</span>
      )}
    </div>
  );
};
