import { AddNewItemModal } from './new-item-modal/AddNewItemModal';
import { Item } from './item';
import { ClaimHeaderMiscActions } from './ClaimHeaderMiscActions';

interface ClaimPageHeaderActionsProps {
  addItem: (item: Item | Item[]) => void;
  lastProgressUpdate: string | null;
}

export const ClaimPageHeaderActions = ({
  addItem,
  lastProgressUpdate,
}: ClaimPageHeaderActionsProps) => {
  return (
    <div className="flex items-center mb-2 gap-2">
      <ClaimHeaderMiscActions lastProgressUpdate={lastProgressUpdate} />
      <AddNewItemModal addItem={addItem} />
    </div>
  );
};
