import React from 'react';
import {
  AddNewItemModal,
  AddNewItemModalRef,
} from './new-item-modal/AddNewItemModal';
import { Item } from './item';
import { ClaimHeaderMiscActions } from './claim-actions/ClaimHeaderMiscActions';

interface ClaimPageHeaderActionsProps extends React.PropsWithChildren {
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

export const ClaimPageHeaderActions = React.forwardRef<
  AddNewItemModalRef,
  ClaimPageHeaderActionsProps
>(
  (
    {
      addItem,
      lastProgressUpdate,
      isDeleted = false,
      claimNumber,
      handler,
    }: ClaimPageHeaderActionsProps,
    ref
  ) => {
    return (
      <div className="flex items-center gap-2">
        <ClaimHeaderMiscActions
          lastProgressUpdate={lastProgressUpdate}
          isDeleted={isDeleted}
          claimNumber={claimNumber}
          handler={handler}
        />
        <AddNewItemModal ref={ref} addItem={addItem} isDeleted={isDeleted} />
      </div>
    );
  }
);
