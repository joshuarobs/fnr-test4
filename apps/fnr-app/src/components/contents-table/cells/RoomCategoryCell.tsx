import React, { useState, useCallback } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import { Item } from '../item';
import { RoomCategory } from '../roomCategories';
import { RoomCategoryBadge } from '../RoomCategoryBadge';
import { RoomCategoryDropdown } from '../shared/RoomCategoryDropdown';

interface RoomCategoryCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
}

export const RoomCategoryCell = ({
  item,
  updateItem,
}: RoomCategoryCellProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleRoomSelect = useCallback(
    (newRoom: RoomCategory | null) => {
      setIsEditing(false);
      if (newRoom !== item.roomCategory) {
        updateItem({ ...item, roomCategory: newRoom });
      }
    },
    [item, updateItem]
  );

  if (isEditing) {
    return (
      <div className="relative">
        <RoomCategoryDropdown
          selectedRoom={item.roomCategory}
          onRoomSelect={handleRoomSelect}
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

  // Handle null room category
  if (item.roomCategory === null) {
    return (
      <div className="flex items-center w-full">
        <div
          onDoubleClick={handleDoubleClick}
          className="cursor-pointer flex-grow text-muted-foreground italic ml-2"
        >
          No room
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full">
      <div
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer flex-grow h-full flex items-center ml-2"
      >
        <RoomCategoryBadge roomCategory={item.roomCategory} />
      </div>
    </div>
  );
};
