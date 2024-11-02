import { KeyboardEvent, useEffect, useState } from 'react';
import {
  Input,
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
} from '@react-monorepo/shared';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';
import { placeholderContentsData } from '../placeholderContentsData';

const labelMinWidthClass = 'min-w-[80px] text-right';

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
}

export function QuickAddTab({
  quickAddInput,
  setQuickAddInput,
  selectedGroup,
  setSelectedGroup,
  groupOpen,
  setGroupOpen,
  handleQuickAdd,
}: QuickAddTabProps) {
  const [groups, setGroups] = useState<Array<{ value: string; label: string }>>(
    []
  );

  useEffect(() => {
    setGroups(getAllGroups());
  }, []);

  return (
    <div className="space-y-2">
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
    </div>
  );
}
