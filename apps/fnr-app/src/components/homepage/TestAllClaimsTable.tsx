import { useQuery } from '@tanstack/react-query';
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

interface Claim {
  id: number;
  claimNumber: string;
  description: string;
  status: string;
  items: { id: number }[];
  totalClaimed: number;
  totalApproved: number | null;
  createdAt: string;
  updatedAt: string;
}

const fetchClaims = async () => {
  const response = await fetch('http://localhost:3333/api/claims?limit=10');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const TestAllClaimsTable = () => {
  const navigate = useNavigate();
  const {
    data: claims,
    isLoading,
    error,
  } = useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
  });

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
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
