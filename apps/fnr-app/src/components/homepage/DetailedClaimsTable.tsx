import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@react-monorepo/shared';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useGetClaimsQuery } from '../../store/services/api';
import type { FilterFn } from '@tanstack/react-table';
import { WarningIconTooltip } from '../contents-other/WarningIconTooltip';
import { GreenTickIcon } from '../contents-table/GreenTickIcon';
import { ClaimHeaderMiscActions } from '../contents-table/ClaimHeaderMiscActions';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

interface ClaimOverview {
  id: number;
  claimNumber: string;
  description: string;
  status: string;
  items: { id: number }[];
  totalClaimed: number;
  totalApproved: number | null;
  createdAt: string;
  updatedAt: string;
  insuredProgressPercent: number;
  ourProgressPercent: number;
  lastProgressUpdate: string | null;
}

/**
 * Format a number value, with special handling for zero
 */
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  if (Math.abs(value) < 0.01) return '0';
  return value.toLocaleString();
};

/**
 * DetailedClaimsTable displays a paginated table of all claims with detailed information
 * including status, progress, and financial data
 */
export const DetailedClaimsTable = () => {
  const navigate = useNavigate();
  const { data: claims, isLoading, error } = useGetClaimsQuery();

  const columns = React.useMemo<ColumnDef<ClaimOverview>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorFn: (row) => row.id,
      },
      {
        id: 'claimNumber',
        header: 'Claim #',
        accessorFn: (row) => row.claimNumber,
      },
      {
        id: 'description',
        header: 'Description',
        accessorFn: (row) => row.description,
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => row.status,
      },
      {
        id: 'items',
        header: 'Items #',
        accessorFn: (row) => row.items.length,
      },
      {
        id: 'totalClaimed',
        header: 'Total Claimed ($)',
        accessorFn: (row) => row.totalClaimed,
      },
      {
        id: 'totalApproved',
        header: 'Total Approved ($)',
        accessorFn: (row) => row.totalApproved,
      },
      {
        id: 'insuredProgress',
        header: "Insured's Progress",
        accessorFn: (row) => row.insuredProgressPercent,
      },
      {
        id: 'ourProgress',
        header: 'Our Progress',
        accessorFn: (row) => row.ourProgressPercent,
      },
      {
        id: 'createdAt',
        header: 'Created',
        accessorFn: (row) => row.createdAt,
      },
      {
        id: 'updatedAt',
        header: 'Last Updated',
        accessorFn: (row) => row.updatedAt,
      },
      {
        id: 'actions',
        header: 'Actions',
        accessorFn: (row) => row.lastProgressUpdate,
      },
    ],
    []
  );

  const table = useReactTable<ClaimOverview>({
    data: claims || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    filterFns: {
      fuzzy: (() => true) as FilterFn<ClaimOverview>,
      faceted: (() => true) as FilterFn<ClaimOverview>,
    },
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
    <div className="space-y-4">
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
            {table.getRowModel().rows?.map((row) => {
              const claim = row.original;
              return (
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
                  <TableCell className="text-right">
                    {claim.items.length}
                  </TableCell>
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
                      {claim.ourProgressPercent !== 100 &&
                        claim.totalApproved && (
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
                  <TableCell
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <ClaimHeaderMiscActions
                      lastProgressUpdate={claim.lastProgressUpdate}
                      claimNumber={claim.claimNumber}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
