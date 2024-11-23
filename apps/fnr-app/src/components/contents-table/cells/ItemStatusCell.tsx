import React, { useState, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@react-monorepo/shared';
import { Item } from '../item';
import { ItemStatus } from '../ItemStatus';
import { ItemStatusBadge } from '../ItemStatusBadge';

interface ItemStatusCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
}

// Component for selecting item status with a dropdown
export const StatusDropdown = ({
  selectedStatus,
  onStatusSelect,
  onOpenChange,
  defaultOpen = false,
  className = '',
}: {
  selectedStatus: string;
  onStatusSelect: (
    status: (typeof ItemStatus)[keyof typeof ItemStatus]
  ) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}) => {
  return (
    <Select
      defaultOpen={defaultOpen}
      onValueChange={onStatusSelect}
      defaultValue={selectedStatus}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(ItemStatus).map((status) => (
          <SelectItem key={status} value={status}>
            <ItemStatusBadge itemStatus={status} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Main ItemStatusCell component
export const ItemStatusCell = ({ item, updateItem }: ItemStatusCellProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleStatusSelect = useCallback(
    (newStatus: (typeof ItemStatus)[keyof typeof ItemStatus]) => {
      setIsEditing(false);
      if (newStatus !== item.itemStatus) {
        updateItem({ ...item, itemStatus: newStatus });
      }
    },
    [item, updateItem]
  );

  if (isEditing) {
    return (
      <div className="relative">
        <StatusDropdown
          selectedStatus={item.itemStatus}
          onStatusSelect={handleStatusSelect}
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
    <div onDoubleClick={handleDoubleClick} className="cursor-pointer flex-grow">
      <ItemStatusBadge itemStatus={item.itemStatus} />
    </div>
  );
};
