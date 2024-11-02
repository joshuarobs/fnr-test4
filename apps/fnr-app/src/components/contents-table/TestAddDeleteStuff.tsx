import { AddNewItemModal } from './new-item-modal/AddNewItemModal';
import { Item } from './item';

interface TestAddDeleteStuffProps {
  newItemName: string;
  setNewItemName: (updatedItem: string) => void;
  handleAddItem: () => void;
  handleRemoveLastItem: () => void;
  addItem: (item: Item) => void;
}

export const TestAddDeleteStuff = ({
  newItemName,
  setNewItemName,
  handleAddItem,
  handleRemoveLastItem,
  addItem,
}: TestAddDeleteStuffProps) => {
  return (
    <div className="flex items-center mb-2">
      <AddNewItemModal addItem={addItem} />
      {/* <Button onClick={handleRemoveLastItem}>Remove Last Item</Button> */}
    </div>
  );
};
