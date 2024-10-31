import { useState, useCallback, KeyboardEvent } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  Input,
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

interface AddNewItemModalProps {
  onConfirm: () => void;
}

export function AddNewItemModal({ onConfirm }: AddNewItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'multi'>('quick');
  const [quickAddInput, setQuickAddInput] = useState('');
  const [multiAddInput, setMultiAddInput] = useState('');
  const [groupOpen, setGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');

  const handleQuickAdd = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && quickAddInput.trim()) {
        onConfirm();
        setQuickAddInput('');
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [quickAddInput, onConfirm]
  );

  const handleMultiAdd = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        const items = multiAddInput
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);

        if (items.length > 0) {
          onConfirm();
          setMultiAddInput('');
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [multiAddInput, onConfirm]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          + Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex space-x-1 border-b">
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              'focus:outline-none',
              activeTab === 'quick'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
            onClick={() => setActiveTab('quick')}
          >
            Add
          </button>
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              'focus:outline-none',
              activeTab === 'multi'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
            onClick={() => setActiveTab('multi')}
          >
            Multi Add
          </button>
        </div>

        <div className="pt-4">
          {activeTab === 'quick' ? (
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
                        ? groups.find((group) => group.value === selectedGroup)
                            ?.label
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
                                  currentValue === selectedGroup
                                    ? ''
                                    : currentValue
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
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Press Enter for new line, Shift+Enter to add all items
              </p>
              <textarea
                className="w-full min-h-[200px] p-2 rounded-md border border-input bg-transparent text-sm"
                placeholder="Enter multiple items, one per line"
                value={multiAddInput}
                onChange={(e) => setMultiAddInput(e.target.value)}
                onKeyDown={handleMultiAdd}
                autoFocus
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
