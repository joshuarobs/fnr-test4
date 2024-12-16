import { Button } from '@react-monorepo/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { MoreHorizontal, RefreshCw } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useRecalculateQuotesMutation } from '../../store/services/api';
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
    if (!lastProgressUpdate) return 'Never calculated';
    return `Last calculated ${formatDistanceToNow(
      new Date(lastProgressUpdate)
    )} ago`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="p-2">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          {getLastUpdateText()}
        </div>
        <DropdownMenuItem onClick={handleRecalculateValues}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Recalculate values
        </DropdownMenuItem>
        <DropdownMenuItem>Export Items</DropdownMenuItem>
        <DropdownMenuItem>Print View</DropdownMenuItem>
        <DropdownMenuItem>Archive Claim</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
