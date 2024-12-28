import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  useToast,
} from '@react-monorepo/shared';
import {
  useArchiveClaimMutation,
  useUnarchiveClaimMutation,
} from '../../../store/services/api';

interface ArchiveClaimDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleted: boolean;
  claimNumber: string;
  onSuccess?: () => void;
}

/**
 * ArchiveClaimDialog - A dialog component for archiving and unarchiving claims
 * Handles both archive and unarchive operations with appropriate UI states and error handling
 */
export const ArchiveClaimDialog = ({
  isOpen,
  onOpenChange,
  isDeleted,
  claimNumber,
  onSuccess,
}: ArchiveClaimDialogProps) => {
  const [archiveClaim] = useArchiveClaimMutation();
  const [unarchiveClaim] = useUnarchiveClaimMutation();
  const [archiveReason, setArchiveReason] = useState('');
  const { toast } = useToast();

  const handleClose = () => {
    onOpenChange(false);
    setArchiveReason('');
  };

  const handleSubmit = async () => {
    try {
      if (isDeleted) {
        await unarchiveClaim({
          claimNumber: claimNumber,
          userId: 1, // TODO: Get actual user ID
        }).unwrap();
      } else {
        await archiveClaim({
          claimNumber: claimNumber,
          userId: 1, // TODO: Get actual user ID
          reason: archiveReason,
        }).unwrap();
      }
      handleClose();
      onSuccess?.();
    } catch (err) {
      console.error(
        `Failed to ${isDeleted ? 'unarchive' : 'archive'} claim:`,
        err
      );
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${
          isDeleted ? 'unarchive' : 'archive'
        } claim. Please try again.`,
      });
      // Keep dialog open if there's an error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeleted ? 'Reopen Claim' : 'Archive Claim'}
          </DialogTitle>
          <DialogDescription>
            {isDeleted
              ? 'Are you sure you want to reopen this claim?'
              : 'Are you sure you want to archive this claim? This action can be undone by an administrator.'}
          </DialogDescription>
        </DialogHeader>
        {!isDeleted && (
          <div className="py-4">
            <Input
              placeholder="Reason for archiving"
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={isDeleted ? 'default' : 'destructive'}
            onClick={handleSubmit}
          >
            {isDeleted ? 'Reopen' : 'Archive'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
