import { useState, useCallback, KeyboardEvent } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from '@react-monorepo/shared';
import { PlusIcon } from '@radix-ui/react-icons';
import { File, Files } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';
import { QuickAddTab } from './QuickAddTab';
import { MultiAddTab } from './MultiAddTab';
import { Item } from '../item';
import { ItemCategory } from '../itemCategories';

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

export function AddNewItemModal({ addItem }: AddNewItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Single);
  const [quickAddInput, setQuickAddInput] = useState('');
  const [multiAddInput, setMultiAddInput] = useState('');
  const [groupOpen, setGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [addItemHasMinReqs, setAddItemHasMinReqs] = useState(false);
  const [multiAddHasMinReqs, setMultiAddHasMinReqs] = useState(false);
  const [quickAddHasChanges, setQuickAddHasChanges] = useState(false);
  const [multiAddHasChanges, setMultiAddHasChanges] = useState(false);

  const createNewItem = (name: string, group: string = ''): Item => {
    return {
      id: Date.now(), // This will be overridden by MainContents' addItem function
      name: name.trim(),
      group: group,
      category: ItemCategory.Other,
      status: 'NR',
      oisquote: null,
      ourquote: 0,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
    };
  };

  const handleQuickAdd = useCallback(
    (e: KeyboardEvent<HTMLInputElement> | { key: string }) => {
      if (e.key === 'Enter' && quickAddInput.trim()) {
        const newItem = createNewItem(quickAddInput, selectedGroup);
        addItem(newItem);
        setQuickAddInput('');
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [quickAddInput, selectedGroup, addItem]
  );

  const handleMultiAdd = () => {
    const items = multiAddInput
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((itemName) => createNewItem(itemName, selectedGroup));

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
    setQuickAddHasChanges(value.trim() !== '' || selectedGroup !== '');
  };

  // Update multiAddHasMinReqs and multiAddHasChanges whenever multiAddInput changes
  const handleMultiAddInputChange = (value: string) => {
    setMultiAddInput(value);
    setMultiAddHasMinReqs(value.trim() !== '');
    setMultiAddHasChanges(value.trim() !== '');
  };

  // Update quickAddHasChanges when group changes
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setQuickAddHasChanges(quickAddInput.trim() !== '' || value !== '');
  };

  const handleClearFields = () => {
    if (activeTab === TabType.Single) {
      setQuickAddInput('');
      setSelectedGroup('');
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
              selectedGroup={selectedGroup}
              setSelectedGroup={handleGroupChange}
              groupOpen={groupOpen}
              setGroupOpen={setGroupOpen}
              handleQuickAdd={handleQuickAdd}
            />
          ) : (
            <MultiAddTab
              multiAddInput={multiAddInput}
              setMultiAddInput={handleMultiAddInputChange}
            />
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
