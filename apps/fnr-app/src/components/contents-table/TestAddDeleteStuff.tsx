import { Button, Input } from '@react-monorepo/shared';
import { AddNewItemModal } from './new-item-modal/AddNewItemModal';

interface TestAddDeleteStuffProps {
  newItemName: string;
  setNewItemName: (updatedItem: string) => void;
  handleAddItem: () => void;
  handleRemoveLastItem: () => void;
}

export const TestAddDeleteStuff = ({
  newItemName,
  setNewItemName,
  handleAddItem,
  handleRemoveLastItem,
}: TestAddDeleteStuffProps) => {
  return (
    <div className="flex items-center mb-2">
      <Input
        type="text"
        placeholder="New item name"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        className="w-[200px] mr-2"
      />
      <AddNewItemModal onConfirm={handleAddItem} />
      <Button onClick={handleRemoveLastItem}>Remove Last Item</Button>
    </div>
  );
};
