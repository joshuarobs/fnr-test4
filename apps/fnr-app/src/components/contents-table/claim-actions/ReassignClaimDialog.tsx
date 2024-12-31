import { useState } from 'react';
import { useReassignClaimMutation } from '../../../store/services/api';
import { ReassignClaimIcon } from '../../icons/ReassignClaimIcon';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Separator,
  useToast,
} from '@react-monorepo/shared';
import { NavAvatar } from '../../contents-other/NavAvatar';
import { UserSearchDropdown } from '../../claims/UserSearchDropdown';

interface Handler {
  id: number;
  firstName: string;
  lastName: string;
  avatarColour: string;
  staff: {
    employeeId: string;
    department: string;
    position: string;
  };
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  department?: string;
  avatarColour?: string;
}

interface ReassignClaimDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handler?: Handler;
  users: User[];
  claimNumber: string;
}

/**
 * ReassignClaimDialog - A dialog component for reassigning claims to different handlers
 * Displays current handler and allows searching/selecting a new handler
 */
export const ReassignClaimDialog = ({
  isOpen,
  onOpenChange,
  handler,
  users,
  claimNumber,
}: ReassignClaimDialogProps) => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reassignClaim] = useReassignClaimMutation();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setSelectedUser(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReassignClaimIcon className="h-4 w-4" />
            Re-assign Claim
          </DialogTitle>
          <Separator className="mt-2" />
          <DialogDescription>
            Change the handler assigned to this claim
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 space-y-4">
          <div className="space-y-2">
            <Label>Currently assigned to</Label>
            <div className="w-fit">
              <NavAvatar
                userInitials={
                  handler
                    ? `${handler.firstName[0]}${handler.lastName[0]}`
                    : undefined
                }
                color={handler?.avatarColour}
                name={
                  handler
                    ? `${handler.firstName} ${handler.lastName}`
                    : undefined
                }
                userId={handler?.staff?.employeeId}
                department={handler?.staff?.department}
              />
            </div>
          </div>
          <div>
            <Label>Assign to</Label>
          </div>
          <UserSearchDropdown
            selectedUser={selectedUser}
            onUserSelect={setSelectedUser}
            users={users}
            showChevron
            className="min-w-[240px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedUser(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!claimNumber) return;
              try {
                await reassignClaim({
                  claimNumber,
                  employeeId: selectedUser?.id || null,
                }).unwrap();
                onOpenChange(false);
                setSelectedUser(null);
              } catch (err) {
                console.error('Failed to reassign claim:', err);
                toast({
                  variant: 'destructive',
                  title: 'Error',
                  description: 'Failed to reassign claim. Please try again.',
                });
              }
            }}
            // Disable if selected user is the same as current handler
            disabled={selectedUser?.id === handler?.staff?.employeeId}
          >
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
