import { Button } from '@react-monorepo/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { MoreHorizontal } from 'lucide-react';

/**
 * ClaimHeaderMiscActions - A component that provides additional actions through a three dots menu dropdown
 * This allows users to access secondary functions that don't need primary visibility in the header
 */
export const ClaimHeaderMiscActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="p-2">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Export Items</DropdownMenuItem>
        <DropdownMenuItem>Print View</DropdownMenuItem>
        <DropdownMenuItem>Archive Claim</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
