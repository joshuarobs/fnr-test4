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

/**
 * ClaimHeaderMiscActions - A component that provides additional actions through a three dots menu dropdown
 * This allows users to access secondary functions that don't need primary visibility in the header
 */
export const ClaimHeaderMiscActions = () => {
  const { id } = useParams<{ id: string }>();
  const [recalculateQuotes] = useRecalculateQuotesMutation();

  const handleRecalculateQuotes = async () => {
    if (!id) return;
    try {
      await recalculateQuotes(id).unwrap();
    } catch (err) {
      console.error('Failed to recalculate quotes:', err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="p-2">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleRecalculateQuotes}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Recalculate quotes
        </DropdownMenuItem>
        <DropdownMenuItem>Export Items</DropdownMenuItem>
        <DropdownMenuItem>Print View</DropdownMenuItem>
        <DropdownMenuItem>Archive Claim</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
