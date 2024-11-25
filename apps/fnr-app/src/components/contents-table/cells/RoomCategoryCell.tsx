import React, { useState, useCallback } from 'react';
import { Item } from '../item';
import {
  RoomCategory,
  roomCategoryDisplayNames,
  NO_ROOM_CATEGORY_VALUE,
} from '../roomCategories';
import { RoomCategoryBadge } from '../RoomCategoryBadge';
import { FilterableDropdown } from '../shared/FilterableDropdown';

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

  const handleCategorySelect = useCallback(
    (newCategory: RoomCategory | null) => {
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
        <FilterableDropdown
          selectedValue={item.roomCategory}
          onValueSelect={handleCategorySelect}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
            }
          }}
          defaultOpen
          className="w-full"
          values={Object.values(RoomCategory)}
          noValueOption={NO_ROOM_CATEGORY_VALUE}
          filterPlaceholder="Filter rooms..."
          renderTriggerContent={(category) =>
            category ? (
              <RoomCategoryBadge roomCategory={category} showTooltip={false} />
            ) : (
              <span className="text-gray-500">Select room...</span>
            )
          }
          renderItemContent={(category) => (
            <RoomCategoryBadge roomCategory={category} showTooltip={false} />
          )}
          renderNoValueContent={() => (
            <span className="text-gray-500">Select room...</span>
          )}
          getFilterText={(category) => roomCategoryDisplayNames[category]}
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
