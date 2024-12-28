import {
  Button,
  useToast,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@react-monorepo/shared';
import { ArchiveClaimDialog } from './ArchiveClaimDialog';
import { ReassignClaimDialog } from './ReassignClaimDialog';
import { useState } from 'react';
import {
  Archive,
  FileSpreadsheet,
  File,
  MoreHorizontal,
  RefreshCw,
  UserCog,
} from 'lucide-react';
import {
  useArchiveClaimMutation,
  useRecalculateQuotesMutation,
  useUnarchiveClaimMutation,
} from '../../../store/services/api';
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
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);

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

      <ArchiveClaimDialog
        isOpen={isArchiveDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsArchiveDialogOpen(open);
          if (!open) {
            setIsDropdownOpen(false);
          }
        }}
        isDeleted={isDeleted}
        claimNumber={claimNumber}
      />

      <ReassignClaimDialog
        isOpen={isReassignDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsReassignDialogOpen(open);
          if (!open) {
            setIsDropdownOpen(false);
          }
        }}
        handler={handler}
      />
    </>
  );
};
