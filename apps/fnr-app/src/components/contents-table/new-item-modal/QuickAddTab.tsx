import { KeyboardEvent, useEffect, useState } from 'react';
import {
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  InputClearable,
  RadioGroup,
  RadioGroupItem,
  Input,
} from '@react-monorepo/shared';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';
import { placeholderContentsData } from '../placeholderContentsData';
import { ItemCategory } from '../itemCategories';
import {
  ItemStatus,
  ItemStatusType,
  ORDERED_ITEM_STATUSES,
} from '../ItemStatus';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { CategoryDropdown } from '../shared/CategoryDropdown';
import { RoomCategory } from '../roomCategories';

const labelMinWidthClass = 'min-w-[80px] text-right';

// Function to get all unique rooms from placeholderContentsData
const getAllRooms = () => {
  const uniqueRooms = new Set<string>();
  placeholderContentsData.forEach((item) => {
    if (item.roomCategory) {
      uniqueRooms.add(item.roomCategory);
    }
  });
  return Array.from(uniqueRooms)
    .sort()
    .map((room) => ({ value: room.toLowerCase(), label: room }));
};

interface QuickAddTabProps {
  quickAddInput: string;
  setQuickAddInput: (value: string) => void;
  modelSerialInput: string;
  setModelSerialInput: (value: string) => void;
  quantityInput: string;
  setQuantityInput: (value: string) => void;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  roomOpen: boolean;
  setRoomOpen: (value: boolean) => void;
  handleQuickAdd: (e: KeyboardEvent<HTMLInputElement>) => void;
  selectedCategory: ItemCategory | null;
  setSelectedCategory: (category: ItemCategory | null) => void;
  categoryOpen: boolean;
  setCategoryOpen: (open: boolean) => void;
  selectedStatus: ItemStatusType;
  setSelectedStatus: (status: ItemStatusType) => void;
}

export function QuickAddTab({
  quickAddInput,
  setQuickAddInput,
  modelSerialInput,
  setModelSerialInput,
  quantityInput,
  setQuantityInput,
  selectedRoom,
  setSelectedRoom,
  roomOpen,
  setRoomOpen,
  handleQuickAdd,
  selectedCategory,
  setSelectedCategory,
  categoryOpen,
  setCategoryOpen,
  selectedStatus,
  setSelectedStatus,
}: QuickAddTabProps) {
  const [rooms, setRooms] = useState<Array<{ value: string; label: string }>>(
    []
  );

  useEffect(() => {
    // Convert RoomCategory enum to options
    const roomOptions = Object.values(RoomCategory).map((room) => ({
      value: room.toLowerCase(),
      label: room
        .replace(/_/g, ' ')
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        ),
    }));
    setRooms(roomOptions);
  }, []);

  // Handle quantity input to only allow numbers
  const handleQuantityChange = (value: string) => {
    // Remove any non-digit characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Ensure the value is not empty and is a positive number
    if (numericValue === '' || parseInt(numericValue) === 0) {
      setQuantityInput('1');
    } else {
      setQuantityInput(numericValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label htmlFor="name" className={labelMinWidthClass}>
          Name
        </Label>
        <InputClearable
          id="name"
          name="item-name"
          autoComplete="off"
          defaultValue=""
          placeholder="e.g. Shirt, Table, Shovel, etc..."
          className="flex-1"
          value={quickAddInput}
          onChange={(e) => setQuickAddInput(e.target.value)}
          onKeyDown={handleQuickAdd}
          onClear={() => setQuickAddInput('')}
          autoFocus
        />
      </div>

      {/* Quantity Field */}
      <div className="flex items-center gap-4">
        <Label htmlFor="quantity" className={labelMinWidthClass}>
          Quantity
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          autoComplete="off"
          defaultValue="1"
          placeholder="Enter quantity..."
          className="flex-1"
          value={quantityInput}
          onChange={(e) => handleQuantityChange(e.target.value)}
          onKeyDown={handleQuickAdd}
        />
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="room" className={labelMinWidthClass}>
          Room
        </Label>
        <Popover open={roomOpen} onOpenChange={setRoomOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={roomOpen}
              className="flex-1 justify-between"
            >
              {selectedRoom
                ? rooms.find((room) => room.value === selectedRoom)?.label
                : 'Select room...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            style={{
              ['--radix-popover-trigger-width' as any]:
                'var(--radix-popover-trigger-width)',
            }}
          >
            <Command>
              <CommandInput placeholder="Search room..." />
              <CommandList>
                <CommandEmpty>No room found.</CommandEmpty>
                <CommandGroup>
                  {rooms.map((room) => (
                    <CommandItem
                      key={room.value}
                      value={room.value}
                      onSelect={(currentValue) => {
                        setSelectedRoom(
                          currentValue === selectedRoom ? '' : currentValue
                        );
                        setRoomOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedRoom === room.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {room.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Category Section */}
      <div className="flex items-center gap-4">
        <Label className={labelMinWidthClass}>Category</Label>
        <div className="flex-1">
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onOpenChange={setCategoryOpen}
            className="w-full"
          />
        </div>
      </div>

      {/* Status Section */}
      <div className="flex items-center gap-4">
        <Label className={labelMinWidthClass}>Status</Label>
        <RadioGroup
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as ItemStatusType)}
          className="flex gap-3 flex-1"
        >
          {ORDERED_ITEM_STATUSES.map((status) => (
            <div
              key={status}
              className="flex items-center cursor-pointer rounded-md px-3 py-1.5 hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedStatus(status)}
            >
              <Label
                htmlFor={`status-${status}`}
                className="flex items-center cursor-pointer"
              >
                <RadioGroupItem value={status} id={`status-${status}`} />
                <span className="ml-2">
                  <ItemStatusBadge itemStatus={status} />
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Model/Serial Number Section */}
      <div className="flex items-center gap-4">
        <Label htmlFor="modelSerial" className={labelMinWidthClass}>
          Model/SN
        </Label>
        <InputClearable
          id="modelSerial"
          name="model-serial"
          autoComplete="off"
          defaultValue=""
          placeholder="Model or Serial Number..."
          className="flex-1"
          value={modelSerialInput}
          onChange={(e) => setModelSerialInput(e.target.value)}
          onKeyDown={handleQuickAdd}
          onClear={() => setModelSerialInput('')}
        />
      </div>
    </div>
  );
}
