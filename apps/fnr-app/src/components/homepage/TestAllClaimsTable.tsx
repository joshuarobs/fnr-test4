import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@react-monorepo/shared';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  useGetClaimsQuery,
  useRecalculateQuotesMutation,
} from '../../store/services/api';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { MoreHorizontal, RefreshCw } from 'lucide-react';

/**
 * TableRowActions - A component that provides additional actions through a three dots menu dropdown
 * Modified version of ClaimHeaderMiscActions for use in the claims table
 */
const TableRowActions = ({
  claimId,
  onClick,
}: {
  claimId: string;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const [recalculateQuotes] = useRecalculateQuotesMutation();

  const handleRecalculateValues = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    try {
      await recalculateQuotes(claimId);
    } catch (err) {
      console.error('Failed to recalculate values:', err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="outline" size="icon" className="p-2">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleRecalculateValues}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Recalculate values
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
          Export Items
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
          Print View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
          Archive Claim
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TestAllClaimsTable = () => {
  const navigate = useNavigate();
  const { data: claims, isLoading, error } = useGetClaimsQuery();

  if (isLoading) {
    return <div className="p-4">Loading claims...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Claim #</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items #</TableHead>
            <TableHead>Total Claimed</TableHead>
            <TableHead>Total Approved</TableHead>
            <TableHead className="whitespace-pre-line">
              {'Insureds\nProgress'}
            </TableHead>
            <TableHead className="whitespace-pre-line">
              {'Our\nProgress'}
            </TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims?.map((claim) => (
            <TableRow
              key={claim.id}
              className="cursor-pointer hover:bg-gray-50 relative"
              onClick={() => navigate(`/claim/${claim.claimNumber}`)}
            >
              <TableCell className="relative p-2">
                <a
                  href={`/claim/${claim.claimNumber}`}
                  onClick={(e) => e.preventDefault()}
                  className="absolute inset-0 z-10 opacity-0"
                >
                  {claim.claimNumber}
                </a>
                {claim.id}
              </TableCell>
              <TableCell>{claim.claimNumber}</TableCell>
              <TableCell>{claim.description}</TableCell>
              <TableCell>
                <span className="rounded-full px-2 py-1 text-xs font-medium capitalize bg-blue-100 text-blue-800">
                  {claim.status.toLowerCase().replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell>{claim.items.length}</TableCell>
              <TableCell>${claim.totalClaimed.toLocaleString()}</TableCell>
              <TableCell>
                {claim.totalApproved
                  ? `$${claim.totalApproved.toLocaleString()}`
                  : '-'}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {claim.items.length > 0
                  ? `${Math.round(claim.insuredProgressPercent)}%`
                  : '-'}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {claim.items.length > 0
                  ? `${Math.round(claim.ourProgressPercent)}%`
                  : '-'}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(claim.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(claim.updatedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <TableRowActions
                  claimId={claim.claimNumber}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
