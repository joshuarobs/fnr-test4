import {
  RoomCategory,
  roomCategoryIcons,
  NO_ROOM_CATEGORY_VALUE,
  roomCategoryDisplayNames,
} from '../roomCategories';
import { FilterableDropdown } from './FilterableDropdown';
import { RoomCategoryBadge } from '../RoomCategoryBadge';

interface RoomDropdownProps {
  selectedRoom: RoomCategory | null;
  onRoomSelect: (room: RoomCategory | null) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

// Room category specific implementation using FilterableDropdown
export const RoomDropdown = ({
  selectedRoom,
  onRoomSelect,
  onOpenChange,
  defaultOpen,
  className,
}: RoomDropdownProps) => {
  const renderTriggerContent = (room: RoomCategory | null) => {
    if (room === null) {
      return <div className="text-muted-foreground italic">No room</div>;
    }
    const Icon = roomCategoryIcons[room];
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <RoomCategoryBadge roomCategory={room} showTooltip={false} />
      </div>
    );
  };

  const renderItemContent = (room: RoomCategory) => {
    const Icon = roomCategoryIcons[room];
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <RoomCategoryBadge roomCategory={room} showTooltip={false} />
      </div>
    );
  };

  const renderNoValueContent = () => (
    <div className="flex items-center gap-2 text-muted-foreground italic">
      No room
    </div>
  );

  return (
    <FilterableDropdown
      selectedValue={selectedRoom}
      onValueSelect={onRoomSelect}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      className={className}
      values={Object.values(RoomCategory)}
      noValueOption={NO_ROOM_CATEGORY_VALUE}
      filterPlaceholder="Filter rooms..."
      renderTriggerContent={renderTriggerContent}
      renderItemContent={renderItemContent}
      renderNoValueContent={renderNoValueContent}
      getFilterText={(room) => roomCategoryDisplayNames[room]}
    />
  );
};
