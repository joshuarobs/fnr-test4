import { AddNewItemModal } from './new-item-modal/AddNewItemModal';
import { Item } from './item';
import { ClaimHeaderMiscActions } from './ClaimHeaderMiscActions';

interface ClaimPageHeaderActionsProps {
  addItem: (item: Item | Item[]) => void;
}

export const ClaimPageHeaderActions = ({
  addItem,
}: ClaimPageHeaderActionsProps) => {
  return (
    <div className="flex items-center mb-2 gap-2">
      <ClaimHeaderMiscActions />
      <AddNewItemModal addItem={addItem} />
      {/* <Button onClick={handleRemoveLastItem}>Remove Last Item</Button> */}
    </div>
  );
};
