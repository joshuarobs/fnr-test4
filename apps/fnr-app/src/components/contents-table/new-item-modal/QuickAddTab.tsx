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
} from '@react-monorepo/shared';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';
import { placeholderContentsData } from '../placeholderContentsData';
import { ItemCategory } from '../itemCategories';
import { ItemStatus, ItemStatusType } from '../ItemStatus';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { CategoryDropdown } from '../shared/CategoryDropdown';

const labelMinWidthClass = 'min-w-[80px] text-right';

// Define the order of status options
const STATUS_OPTIONS = [
  ItemStatus.NR,
  ItemStatus.VPOL,
  ItemStatus.RS,
  ItemStatus.OTHER,
] as const;

// Function to get all unique groups from placeholderContentsData
const getAllGroups = () => {
  const uniqueGroups = new Set<string>();
  placeholderContentsData.forEach((item) => {
    if (item.group) {
      uniqueGroups.add(item.group);
    }
  });
  return Array.from(uniqueGroups)
    .sort()
    .map((group) => ({ value: group.toLowerCase(), label: group }));
};

interface QuickAddTabProps {
  quickAddInput: string;
  setQuickAddInput: (value: string) => void;
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  groupOpen: boolean;
  setGroupOpen: (value: boolean) => void;
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
  selectedGroup,
  setSelectedGroup,
  groupOpen,
  setGroupOpen,
  handleQuickAdd,
  selectedCategory,
  setSelectedCategory,
  categoryOpen,
  setCategoryOpen,
  selectedStatus,
  setSelectedStatus,
}: QuickAddTabProps) {
  const [groups, setGroups] = useState<Array<{ value: string; label: string }>>(
    []
  );

  useEffect(() => {
    setGroups(getAllGroups());
  }, []);

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
      <div className="flex items-center gap-4">
        <Label htmlFor="group" className={labelMinWidthClass}>
          Group
        </Label>
        <Popover open={groupOpen} onOpenChange={setGroupOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={groupOpen}
              className="flex-1 justify-between"
            >
              {selectedGroup
                ? groups.find((group) => group.value === selectedGroup)?.label
                : 'Select group...'}
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
              <CommandInput placeholder="Search group..." />
              <CommandList>
                <CommandEmpty>No group found.</CommandEmpty>
                <CommandGroup>
                  {groups.map((group) => (
                    <CommandItem
                      key={group.value}
                      value={group.value}
                      onSelect={(currentValue) => {
                        setSelectedGroup(
                          currentValue === selectedGroup ? '' : currentValue
                        );
                        setGroupOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedGroup === group.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {group.label}
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
      <div>
        <Label className="text-sm font-medium">Status</Label>
        <RadioGroup
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as ItemStatusType)}
          className="mt-2"
        >
          {STATUS_OPTIONS.map((status) => (
            <Label
              key={status}
              htmlFor={`status-${status}`}
              className="flex items-center w-full cursor-pointer rounded-md px-3 py-1.5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={status} id={`status-${status}`} />
                <div className="flex items-center gap-2">
                  <ItemStatusBadge itemStatus={status} />
                </div>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
