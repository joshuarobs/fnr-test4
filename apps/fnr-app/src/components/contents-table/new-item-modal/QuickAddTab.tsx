import { KeyboardEvent } from 'react';
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
} from '@react-monorepo/shared';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';

const labelMinWidthClass = 'min-w-[80px]';

const groups = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'other', label: 'Other' },
];

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
  return (
    <div className="space-y-2">
      <Input
        placeholder="Enter item name and press Enter"
        value={quickAddInput}
        onChange={(e) => setQuickAddInput(e.target.value)}
        onKeyDown={handleQuickAdd}
        autoFocus
      />
      <div className="flex items-center gap-4">
        <Label htmlFor="name" className={labelMinWidthClass}>
          Name
        </Label>
        <Input
          id="name"
          name="item-name"
          autoComplete="off"
          defaultValue=""
          placeholder="e.g. Shirt, Table, Shovel, etc..."
          className="flex-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <Label htmlFor="group" className={labelMinWidthClass}>
          Group
        </Label>
        <Popover open={groupOpen} onOpenChange={setGroupOpen}>
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
