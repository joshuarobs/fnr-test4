import { AddNewItemModal } from './new-item-modal/AddNewItemModal';
import { Item } from './item';
import { ClaimHeaderMiscActions } from './ClaimHeaderMiscActions';

interface ClaimPageHeaderActionsProps {
  addItem: (item: Item | Item[]) => void;
  lastProgressUpdate: string | null;
  isDeleted?: boolean;
  claimNumber: string;
}

export const ClaimPageHeaderActions = ({
  addItem,
  lastProgressUpdate,
  isDeleted = false,
  claimNumber,
}: ClaimPageHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <ClaimHeaderMiscActions
        lastProgressUpdate={lastProgressUpdate}
        isDeleted={isDeleted}
        claimNumber={claimNumber}
      />
      <AddNewItemModal addItem={addItem} />
    </div>
  );
};
