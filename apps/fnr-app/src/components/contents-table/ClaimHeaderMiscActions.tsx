import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
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
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
  useArchiveClaimMutation,
  useRecalculateQuotesMutation,
} from '../../store/services/api';
import { formatDistanceToNow } from 'date-fns';

interface ClaimHeaderMiscActionsProps {
  lastProgressUpdate: string | null;
}

/**
 * ClaimHeaderMiscActions - A component that provides additional actions through a three dots menu dropdown
 * This allows users to access secondary functions that don't need primary visibility in the header
 */
export const ClaimHeaderMiscActions = ({
  lastProgressUpdate,
}: ClaimHeaderMiscActionsProps) => {
  const { id } = useParams<{ id: string }>();
  const [recalculateQuotes] = useRecalculateQuotesMutation();
  const [archiveClaim] = useArchiveClaimMutation();
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');

  const handleRecalculateValues = async () => {
    if (!id) return;
    try {
      await recalculateQuotes(id).unwrap();
    } catch (err) {
      console.error('Failed to recalculate values:', err);
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
      <DropdownMenu>
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
            Export excel sheet
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onClick={() => setIsArchiveDialogOpen(true)}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive Claim
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Archive Confirmation Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Claim</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this claim? This action can be
              undone by an administrator.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Reason for archiving"
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
            />
          </div>
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
              variant="destructive"
              onClick={async () => {
                if (!id) return;
                try {
                  await archiveClaim({
                    claimNumber: id,
                    userId: '1', // TODO: Get actual user ID
                    reason: archiveReason,
                  }).unwrap();
                  setIsArchiveDialogOpen(false);
                  setArchiveReason('');
                } catch (err) {
                  console.error('Failed to archive claim:', err);
                }
              }}
            >
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
