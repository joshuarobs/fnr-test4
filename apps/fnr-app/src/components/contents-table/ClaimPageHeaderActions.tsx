import { AddNewItemModal } from './new-item-modal/AddNewItemModal';
import { Item } from './item';
import { ClaimHeaderMiscActions } from './ClaimHeaderMiscActions';

interface ClaimPageHeaderActionsProps {
  addItem: (item: Item | Item[]) => void;
  lastProgressUpdate: string | null;
  isDeleted?: boolean;
  claimNumber: string;
  handler?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarColour: string;
    staff: {
      id: number;
      employeeId: string;
      department: string;
      position: string;
    };
  };
}

export const ClaimPageHeaderActions = ({
  addItem,
  lastProgressUpdate,
  isDeleted = false,
  claimNumber,
  handler,
}: ClaimPageHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <ClaimHeaderMiscActions
        lastProgressUpdate={lastProgressUpdate}
        isDeleted={isDeleted}
        claimNumber={claimNumber}
        handler={handler}
      />
      <AddNewItemModal addItem={addItem} />
    </div>
  );
};
