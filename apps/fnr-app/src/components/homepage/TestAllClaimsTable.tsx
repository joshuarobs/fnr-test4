import React from 'react';
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
import { useGetClaimsQuery } from '../../store/services/api';
import { WarningIconTooltip } from '../contents-other/WarningIconTooltip';
import { GreenTickIcon } from '../contents-table/GreenTickIcon';
import { ClaimHeaderMiscActions } from '../contents-table/ClaimHeaderMiscActions';

/**
 * Format a number value, with special handling for zero
 */
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  if (Math.abs(value) < 0.01) return '0';
  return value.toLocaleString();
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
            <TableHead className="text-right">ID</TableHead>
            <TableHead>Claim #</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Items #</TableHead>
            <TableHead className="text-right">Total Claimed ($)</TableHead>
            <TableHead className="text-right">Total Approved ($)</TableHead>
            <TableHead className="whitespace-pre-line text-right">
              {'Insureds\nProgress'}
            </TableHead>
            <TableHead className="whitespace-pre-line text-right">
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
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 relative"
              onClick={() => navigate(`/claim/${claim.claimNumber}`)}
            >
              <TableCell className="relative p-2 text-right">
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
                <span className="rounded-full px-2 py-1 text-xs font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {claim.status.toLowerCase().replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell className="text-right">{claim.items.length}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {formatNumber(claim.totalClaimed)}
                  {claim.insuredProgressPercent !== 100 && (
                    <WarningIconTooltip warningString="Total claimed amount may not be final as insureds progress is not complete" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {formatNumber(claim.totalApproved)}
                  {claim.ourProgressPercent !== 100 && claim.totalApproved && (
                    <WarningIconTooltip warningString="Total approved amount may not be final as our progress is not complete" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-right">
                <div className="flex items-center justify-end">
                  {claim.items.length > 0
                    ? `${Math.round(claim.insuredProgressPercent)}%`
                    : '-'}
                  {claim.items.length > 0 &&
                    claim.insuredProgressPercent === 100 && (
                      <GreenTickIcon size="small" />
                    )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-right pr-4">
                <div className="flex items-center justify-end">
                  {claim.items.length > 0
                    ? `${Math.round(claim.ourProgressPercent)}%`
                    : '-'}
                  {claim.items.length > 0 &&
                    claim.ourProgressPercent === 100 && (
                      <GreenTickIcon size="small" />
                    )}
                </div>
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
              <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <ClaimHeaderMiscActions
                  lastProgressUpdate={claim.lastProgressUpdate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
