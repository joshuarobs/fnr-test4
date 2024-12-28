import { useState } from 'react';
import { ReassignClaimIcon } from '../../icons/ReassignClaimIcon';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@react-monorepo/shared';
import { NavAvatar } from '../../contents-other/NavAvatar';

interface ReassignClaimDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handler?: {
    id: number;
    firstName: string;
    lastName: string;
    avatarColour: string;
    staff: {
      employeeId: string;
      department: string;
      position: string;
    };
  };
}

/**
 * ReassignClaimDialog - A dialog component for reassigning claims to different handlers
 * Displays current handler and allows input of new handler's staff ID
 */
export const ReassignClaimDialog = ({
  isOpen,
  onOpenChange,
  handler,
}: ReassignClaimDialogProps) => {
  const [newAssignee, setNewAssignee] = useState('');

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setNewAssignee('');
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReassignClaimIcon className="h-4 w-4" />
            Re-assign Claim
          </DialogTitle>
          <DialogDescription>
            Change the handler assigned to this claim
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Currently assigned to</Label>
            {handler ? (
              <NavAvatar
                userInitials={`${handler.firstName[0]}${handler.lastName[0]}`}
                color={handler.avatarColour}
                name={`${handler.firstName} ${handler.lastName}`}
                userId={handler.staff.employeeId}
                department={handler.staff.department}
              />
            ) : (
              <span className="text-sm text-muted-foreground">Unassigned</span>
            )}
          </div>
          <div className="space-y-2">
            <Label>Assign to</Label>
            <Input
              placeholder="Enter staff ID"
              value={newAssignee}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewAssignee(e.target.value)
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setNewAssignee('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              // TODO: Implement reassignment
              onOpenChange(false);
              setNewAssignee('');
            }}
          >
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
