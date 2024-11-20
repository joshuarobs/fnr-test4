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
import { File, Files } from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';
import { QuickAddTab } from './QuickAddTab';
import { MultiAddTab } from './MultiAddTab';
import { Item } from '../item';
import { ItemCategory, categoryIcons } from '../itemCategories';
import { ItemStatus, ItemStatusType } from '../ItemStatus';
import { ItemStatusBadge } from '../ItemStatusBadge';
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

// Define the order of status options
const STATUS_OPTIONS = [
  ItemStatus.NR,
  ItemStatus.VPOL,
  ItemStatus.RS,
  ItemStatus.OTHER,
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
  modelSerialNumber?: string
): Partial<Item> => {
  return {
    name: name.trim(),
    category,
    itemStatus: status,
    modelSerialNumber: modelSerialNumber?.trim() || null,
  };
};

export function AddNewItemModal({ addItem }: AddNewItemModalProps) {
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Single);
  const [quickAddInput, setQuickAddInput] = useState('');
  const [modelSerialInput, setModelSerialInput] = useState('');
  const [multiAddInput, setMultiAddInput] = useState('');
  const [addItemHasMinReqs, setAddItemHasMinReqs] = useState(false);
  const [multiAddHasMinReqs, setMultiAddHasMinReqs] = useState(false);
  const [quickAddHasChanges, setQuickAddHasChanges] = useState(false);
  const [multiAddHasChanges, setMultiAddHasChanges] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ItemStatusType>(
    ItemStatus.NR
  );
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(
    null
  );
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleQuickAdd = useCallback(
    (e: KeyboardEvent<HTMLInputElement> | { key: string }) => {
      if (e.key === 'Enter' && quickAddInput.trim()) {
        const newItem = createNewItem(
          quickAddInput,
          selectedStatus,
          selectedCategory,
          modelSerialInput
        );
        addItem(newItem as Item);
        setQuickAddInput('');
        setModelSerialInput('');
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [quickAddInput, modelSerialInput, selectedStatus, selectedCategory, addItem]
  );

  const handleMultiAdd = () => {
    const items = multiAddInput
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map(
        (itemName) =>
          createNewItem(itemName, selectedStatus, selectedCategory) as Item
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

  // Update addItemHasMinReqs and quickAddHasChanges whenever quickAddInput changes
  const handleQuickAddInputChange = (value: string) => {
    setQuickAddInput(value);
    setAddItemHasMinReqs(value.trim() !== '');
    setQuickAddHasChanges(value.trim() !== '');
  };

  // Update multiAddHasMinReqs and multiAddHasChanges whenever multiAddInput changes
  const handleMultiAddInputChange = (value: string) => {
    setMultiAddInput(value);
    setMultiAddHasMinReqs(value.trim() !== '');
    setMultiAddHasChanges(value.trim() !== '');
  };

  const handleClearFields = () => {
    if (activeTab === TabType.Single) {
      setQuickAddInput('');
      setModelSerialInput('');
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
      <DialogContent className="sm:max-w-[500px]">
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
              setModelSerialInput={setModelSerialInput}
              selectedGroup=""
              setSelectedGroup={() => {}}
              groupOpen={false}
              setGroupOpen={() => {}}
              handleQuickAdd={handleQuickAdd}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categoryOpen={categoryOpen}
              setCategoryOpen={setCategoryOpen}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
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
                                  setSelectedCategory(
                                    currentValue === 'none'
                                      ? null
                                      : (currentValue as ItemCategory)
                                  );
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
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <RadioGroup
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as ItemStatusType)
                  }
                  className="mt-2"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <Label
                      key={status}
                      htmlFor={`status-${status}`}
                      className="flex items-center w-full cursor-pointer rounded-md px-3 py-1.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={status}
                          id={`status-${status}`}
                        />
                        <div className="flex items-center gap-2">
                          <ItemStatusBadge itemStatus={status} />
                        </div>
                      </div>
                    </Label>
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
