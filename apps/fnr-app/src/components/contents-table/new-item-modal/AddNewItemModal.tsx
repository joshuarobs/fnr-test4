import React, { useState, useCallback, KeyboardEvent } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@react-monorepo/shared';
import { PlusIcon } from '@radix-ui/react-icons';
import { CustomRadioButton } from '../shared/CustomRadioButton';
import { File, Files } from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';
import { QuickAddTab } from './QuickAddTab';
import { MultiAddTab } from './MultiAddTab';
import { Item } from '../item';
import { ItemCategory, categoryIcons } from '../itemCategories';
import {
  ItemStatus,
  ItemStatusType,
  ORDERED_ITEM_STATUSES,
} from '../ItemStatus';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { RoomCategory } from '../roomCategories';
import { useParams } from 'react-router-dom';

interface AddNewItemModalProps {
  addItem: (item: Item | Item[]) => void;
}

enum TabType {
  Single = 'single',
  Multi = 'multi',
}

const TABS = [
  {
    id: TabType.Single,
    label: 'Single item',
    icon: File,
  },
  {
    id: TabType.Multi,
    label: 'Multi add',
    icon: Files,
  },
] as const;

// Define the order of category options
const CATEGORY_OPTIONS = [
  { value: null, label: 'None' },
  ...Object.values(ItemCategory).map((category) => ({
    value: category,
    label: category,
  })),
];

// Helper function to create a new item with only required fields
const createNewItem = (
  name: string,
  status: ItemStatusType,
  category: ItemCategory | null,
  quantity: number,
  roomCategory: RoomCategory | null,
  modelSerialNumber?: string
): Partial<Item> => {
  return {
    name: name.trim(),
    category,
    itemStatus: status,
    quantity,
    roomCategory,
    modelSerialNumber: modelSerialNumber?.trim() || null,
  };
};

// Default values for the form fields
const DEFAULT_VALUES = {
  name: '',
  modelSerial: '',
  quantity: '1',
  room: null as RoomCategory | null,
  category: null as ItemCategory | null,
  status: ItemStatus.NR as ItemStatusType,
};

export function AddNewItemModal({ addItem }: AddNewItemModalProps) {
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Single);
  const [quickAddInput, setQuickAddInput] = useState(DEFAULT_VALUES.name);
  const [modelSerialInput, setModelSerialInput] = useState(
    DEFAULT_VALUES.modelSerial
  );
  const [quantityInput, setQuantityInput] = useState(DEFAULT_VALUES.quantity);
  const [selectedRoom, setSelectedRoom] = useState(DEFAULT_VALUES.room);
  const [multiAddInput, setMultiAddInput] = useState('');
  const [addItemHasMinReqs, setAddItemHasMinReqs] = useState(false);
  const [multiAddHasMinReqs, setMultiAddHasMinReqs] = useState(false);
  const [quickAddHasChanges, setQuickAddHasChanges] = useState(false);
  const [multiAddHasChanges, setMultiAddHasChanges] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_VALUES.status);
  const [selectedCategory, setSelectedCategory] = useState(
    DEFAULT_VALUES.category
  );
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);

  const handleQuickAdd = useCallback(
    (e: KeyboardEvent<HTMLInputElement> | { key: string }) => {
      if (e.key === 'Enter' && quickAddInput.trim()) {
        const quantity = parseInt(quantityInput) || 1; // Default to 1 if invalid
        const newItem = createNewItem(
          quickAddInput,
          selectedStatus,
          selectedCategory,
          quantity,
          selectedRoom,
          modelSerialInput
        );
        addItem(newItem as Item);
        setQuickAddInput(DEFAULT_VALUES.name);
        setModelSerialInput(DEFAULT_VALUES.modelSerial);
        setQuantityInput(DEFAULT_VALUES.quantity);
        setSelectedRoom(DEFAULT_VALUES.room);
        setSelectedCategory(DEFAULT_VALUES.category);
        setSelectedStatus(DEFAULT_VALUES.status);
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [
      quickAddInput,
      modelSerialInput,
      quantityInput,
      selectedRoom,
      selectedStatus,
      selectedCategory,
      addItem,
    ]
  );

  const handleMultiAdd = () => {
    const items = multiAddInput
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map(
        (itemName) =>
          createNewItem(
            itemName,
            selectedStatus,
            selectedCategory,
            1,
            selectedRoom
          ) as Item
      );

    if (items.length > 0) {
      addItem(items);
      setMultiAddInput('');
      setIsOpen(false);
    }
  };

  const handleSubmit = () => {
    if (activeTab === TabType.Single) {
      handleQuickAdd({ key: 'Enter' });
    } else {
      handleMultiAdd();
    }
  };

  // Check if any field has changed from its default value
  const checkQuickAddChanges = (
    name: string,
    modelSerial: string,
    quantity: string,
    room: RoomCategory | null,
    status: ItemStatusType,
    category: ItemCategory | null
  ) => {
    return (
      name !== DEFAULT_VALUES.name ||
      modelSerial !== DEFAULT_VALUES.modelSerial ||
      quantity !== DEFAULT_VALUES.quantity ||
      room !== DEFAULT_VALUES.room ||
      status !== DEFAULT_VALUES.status ||
      category !== DEFAULT_VALUES.category
    );
  };

  // Update addItemHasMinReqs and quickAddHasChanges whenever any field changes
  const handleQuickAddInputChange = (value: string) => {
    setQuickAddInput(value);
    setAddItemHasMinReqs(value.trim() !== '');
    setQuickAddHasChanges(
      checkQuickAddChanges(
        value,
        modelSerialInput,
        quantityInput,
        selectedRoom,
        selectedStatus,
        selectedCategory
      )
    );
  };

  const handleModelSerialInputChange = (value: string) => {
    setModelSerialInput(value);
    setQuickAddHasChanges(
      checkQuickAddChanges(
        quickAddInput,
        value,
        quantityInput,
        selectedRoom,
        selectedStatus,
        selectedCategory
      )
    );
  };

  const handleQuantityInputChange = (value: string) => {
    setQuantityInput(value);
    setQuickAddHasChanges(
      checkQuickAddChanges(
        quickAddInput,
        modelSerialInput,
        value,
        selectedRoom,
        selectedStatus,
        selectedCategory
      )
    );
  };

  const handleRoomChange = (value: RoomCategory | null) => {
    setSelectedRoom(value);
    setQuickAddHasChanges(
      checkQuickAddChanges(
        quickAddInput,
        modelSerialInput,
        quantityInput,
        value,
        selectedStatus,
        selectedCategory
      )
    );
  };

  const handleStatusChange = (value: ItemStatusType) => {
    setSelectedStatus(value);
    setQuickAddHasChanges(
      checkQuickAddChanges(
        quickAddInput,
        modelSerialInput,
        quantityInput,
        selectedRoom,
        value,
        selectedCategory
      )
    );
  };

  const handleCategoryChange = (value: ItemCategory | null) => {
    setSelectedCategory(value);
    setQuickAddHasChanges(
      checkQuickAddChanges(
        quickAddInput,
        modelSerialInput,
        quantityInput,
        selectedRoom,
        selectedStatus,
        value
      )
    );
  };

  // Update multiAddHasMinReqs and multiAddHasChanges whenever multiAddInput changes
  const handleMultiAddInputChange = (value: string) => {
    setMultiAddInput(value);
    setMultiAddHasMinReqs(value.trim() !== '');
    setMultiAddHasChanges(value.trim() !== '');
  };

  const handleClearFields = () => {
    if (activeTab === TabType.Single) {
      setQuickAddInput(DEFAULT_VALUES.name);
      setModelSerialInput(DEFAULT_VALUES.modelSerial);
      setQuantityInput(DEFAULT_VALUES.quantity);
      setSelectedRoom(DEFAULT_VALUES.room);
      setSelectedCategory(DEFAULT_VALUES.category);
      setSelectedStatus(DEFAULT_VALUES.status);
      setAddItemHasMinReqs(false);
      setQuickAddHasChanges(false);
    }
    if (activeTab === TabType.Multi) {
      setMultiAddInput('');
      setMultiAddHasMinReqs(false);
      setMultiAddHasChanges(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full select-none flex items-center justify-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <h4 className="font-medium leading-none">Add a new Item</h4>
        <div className="flex space-x-1 border-b">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
                  'focus:outline-none',
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="pt-4">
          {activeTab === TabType.Single ? (
            <QuickAddTab
              quickAddInput={quickAddInput}
              setQuickAddInput={handleQuickAddInputChange}
              modelSerialInput={modelSerialInput}
              setModelSerialInput={handleModelSerialInputChange}
              quantityInput={quantityInput}
              setQuantityInput={handleQuantityInputChange}
              selectedRoom={selectedRoom}
              setSelectedRoom={handleRoomChange}
              roomOpen={roomOpen}
              setRoomOpen={setRoomOpen}
              handleQuickAdd={handleQuickAdd}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              categoryOpen={categoryOpen}
              setCategoryOpen={setCategoryOpen}
              selectedStatus={selectedStatus}
              setSelectedStatus={handleStatusChange}
            />
          ) : (
            <div className="space-y-4">
              <MultiAddTab
                multiAddInput={multiAddInput}
                setMultiAddInput={handleMultiAddInputChange}
              />

              {/* Category Section */}
              <div className="flex items-center gap-4">
                <Label className="min-w-[80px] text-right">Category</Label>
                <Popover
                  open={categoryOpen}
                  onOpenChange={setCategoryOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className="flex-1 justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {selectedCategory &&
                          React.createElement(categoryIcons[selectedCategory], {
                            className: 'h-4 w-4',
                          })}
                        <span>{selectedCategory || 'None'}</span>
                      </div>
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
                      <CommandInput placeholder="Search category..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {CATEGORY_OPTIONS.map((category) => {
                            const CategoryIcon = category.value
                              ? categoryIcons[category.value]
                              : null;
                            return (
                              <CommandItem
                                key={category.value || 'none'}
                                value={category.value || 'none'}
                                onSelect={(currentValue) => {
                                  const newCategory =
                                    currentValue === 'none'
                                      ? null
                                      : (currentValue as ItemCategory);
                                  handleCategoryChange(newCategory);
                                  setCategoryOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selectedCategory === category.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {CategoryIcon && (
                                    <CategoryIcon className="h-4 w-4" />
                                  )}
                                  <span>{category.label}</span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status Section */}
              <div className="flex items-center gap-4">
                <Label className="min-w-[80px] text-right">Status</Label>
                <RadioGroup
                  value={selectedStatus}
                  onValueChange={(value) =>
                    handleStatusChange(value as ItemStatusType)
                  }
                  className="flex gap-3 flex-1"
                >
                  {ORDERED_ITEM_STATUSES.map((status) => (
                    <CustomRadioButton
                      key={status}
                      value={status}
                      selectedValue={selectedStatus}
                      onChange={(value) =>
                        handleStatusChange(value as ItemStatusType)
                      }
                      label={<ItemStatusBadge itemStatus={status} />}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="w-full flex items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearFields}
              disabled={
                activeTab === TabType.Single
                  ? !quickAddHasChanges
                  : !multiAddHasChanges
              }
              className="text-red-500 select-none mr-auto"
            >
              Clear fields
            </Button>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="select-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  (activeTab === TabType.Single && !addItemHasMinReqs) ||
                  (activeTab === TabType.Multi && !multiAddHasMinReqs)
                }
                className="select-none flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                {activeTab === TabType.Multi ? 'Add Items' : 'Add Item'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
