import { useState, useCallback, KeyboardEvent } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from '@react-monorepo/shared';
import { cn } from '../../../../../../shared/src/lib/utils';
import { QuickAddTab } from './QuickAddTab';
import { MultiAddTab } from './MultiAddTab';

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
  const [addItemHasMinReqs, setAddItemHasMinReqs] = useState(false);

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

  // Update addItemHasMinReqs whenever quickAddInput changes
  const handleQuickAddInputChange = (value: string) => {
    setQuickAddInput(value);
    setAddItemHasMinReqs(value.trim() !== '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full select-none">
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
            <QuickAddTab
              quickAddInput={quickAddInput}
              setQuickAddInput={handleQuickAddInputChange}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              groupOpen={groupOpen}
              setGroupOpen={setGroupOpen}
              handleQuickAdd={handleQuickAdd}
            />
          ) : (
            <MultiAddTab
              multiAddInput={multiAddInput}
              setMultiAddInput={setMultiAddInput}
              handleMultiAdd={handleMultiAdd}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={activeTab === 'quick' && !addItemHasMinReqs}
            className="select-none"
          >
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
