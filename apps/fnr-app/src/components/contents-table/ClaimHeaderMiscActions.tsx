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
  Label,
} from '@react-monorepo/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@react-monorepo/shared';
import { useState } from 'react';
import {
  Archive,
  FileSpreadsheet,
  File,
  MoreHorizontal,
  RefreshCw,
  UserCog,
} from 'lucide-react';
import { NavAvatar } from '../contents-other/NavAvatar';
import {
  useArchiveClaimMutation,
  useRecalculateQuotesMutation,
  useUnarchiveClaimMutation,
} from '../../store/services/api';
import { formatDistanceToNow } from 'date-fns';

interface ClaimHeaderMiscActionsProps {
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

/**
 * ClaimHeaderMiscActions - A component that provides additional actions through a three dots menu dropdown
 * This allows users to access secondary functions that don't need primary visibility in the header
 */
export const ClaimHeaderMiscActions = ({
  lastProgressUpdate,
  isDeleted = false,
  claimNumber,
  handler,
}: ClaimHeaderMiscActionsProps) => {
  const [recalculateQuotes] = useRecalculateQuotesMutation();
  const [archiveClaim] = useArchiveClaimMutation();
  const [unarchiveClaim] = useUnarchiveClaimMutation();
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [newAssignee, setNewAssignee] = useState('');

  const { toast } = useToast();

  const handleRecalculateValues = async () => {
    if (!claimNumber) return;
    try {
      await recalculateQuotes(claimNumber).unwrap();
    } catch (err) {
      console.error('Failed to recalculate values:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to recalculate values. Please try again.',
      });
    }
  };

  // Get last update text using formatDistanceToNow
  const getLastUpdateText = () => {
    if (!lastProgressUpdate) return 'Never calculated before';
    return `Last calculated ${formatDistanceToNow(
      new Date(lastProgressUpdate)
    )} ago`;
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="p-2">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem
            onClick={handleRecalculateValues}
            className="cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <div className="flex flex-col items-start">
              <span>Recalculate values</span>
              <span className="text-xs text-muted-foreground">
                {getLastUpdateText()}
              </span>
            </div>
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem className="cursor-pointer">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to excel sheet
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <File className="mr-2 h-4 w-4" />
            Export to PDF
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsReassignDialogOpen(true);
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Re-assign claim
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            className={`cursor-pointer ${
              isDeleted ? 'text-primary' : 'text-destructive'
            }`}
            onClick={() => {
              setIsDropdownOpen(false);
              setIsArchiveDialogOpen(true);
            }}
          >
            <Archive className="mr-2 h-4 w-4" />
            {isDeleted ? 'Reopen claim' : 'Archive claim'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={isArchiveDialogOpen}
        onOpenChange={(open) => {
          setIsArchiveDialogOpen(open);
          if (!open) {
            setIsDropdownOpen(false);
          }
        }}
      >
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
            <Button
              variant="outline"
              onClick={() => {
                setIsArchiveDialogOpen(false);
                setArchiveReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={isDeleted ? 'default' : 'destructive'}
              onClick={async () => {
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
                  setIsArchiveDialogOpen(false);
                  setArchiveReason('');
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
              }}
            >
              {isDeleted ? 'Reopen' : 'Archive'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog
        open={isReassignDialogOpen}
        onOpenChange={(open) => {
          setIsReassignDialogOpen(open);
          if (!open) {
            setIsDropdownOpen(false);
            setNewAssignee('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Re-assign Claim</DialogTitle>
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
                <span className="text-sm text-muted-foreground">
                  Unassigned
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Input
                placeholder="Enter staff ID"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReassignDialogOpen(false);
                setNewAssignee('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                // TODO: Implement reassignment
                setIsReassignDialogOpen(false);
                setNewAssignee('');
              }}
            >
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
