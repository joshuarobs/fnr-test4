import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';
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
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { NavAvatar } from '../contents-other/NavAvatar';

/**
 * SuppliersTable displays a paginated table of suppliers with their details
 * including contact info, status, and claim allocation information
 */
interface Supplier {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  avatarColour?: string;
  supplier: {
    supplierId: string;
    company: string;
    allocatedClaims: number;
  };
}

interface SuppliersTableProps {
  suppliers?: Supplier[];
}

/**
 * SuppliersTable component that shows supplier information in a paginated table format
 */
export const SuppliersTable = ({ suppliers = [] }: SuppliersTableProps) => {
  const navigate = useNavigate();
  const tableCellClass = 'px-4';

  const columns = React.useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorFn: (row) => row.supplier.supplierId,
      },
      {
        id: 'company',
        header: 'Company',
        accessorFn: (row) => row.supplier.company,
        cell: ({ row }) => (
          <NavAvatar
            company={row.original.supplier.company}
            color={row.original.avatarColour}
            name={row.original.supplier.company}
            userId={row.original.id.toString()}
            disableNavigation={true}
            disableHover
          />
        ),
      },
      {
        id: 'email',
        header: 'Email',
        accessorFn: (row) => row.email,
      },
      {
        id: 'phone',
        header: 'Phone',
        accessorFn: (row) => row.phone || '-',
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => row.isActive,
        cell: ({ getValue }) => (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              getValue()
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}
          >
            {getValue() ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        id: 'allocatedClaims',
        header: 'Allocated Claims',
        accessorFn: (row) => row.supplier.allocatedClaims,
      },
    ],
    []
  );

  const table = useReactTable<Supplier>({
    data: suppliers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    filterFns: {
      fuzzy: (() => true) as FilterFn<Supplier>,
      faceted: (() => true) as FilterFn<Supplier>,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`text-right ${tableCellClass}`}>
                ID
              </TableHead>
              <TableHead className={tableCellClass}>Company</TableHead>
              <TableHead className={tableCellClass}>Email</TableHead>
              <TableHead className={tableCellClass}>Phone</TableHead>
              <TableHead className={tableCellClass}>Status</TableHead>
              <TableHead className={`text-right ${tableCellClass}`}>
                Allocated Claims
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.map((row) => (
              <TableRow
                key={row.original.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
              >
                <TableCell className={`text-right ${tableCellClass}`}>
                  <span className="font-mono text-sm">
                    {row.original.supplier.supplierId}
                  </span>
                </TableCell>
                <TableCell className={tableCellClass}>
                  <NavAvatar
                    company={row.original.supplier.company}
                    color={row.original.avatarColour}
                    name={row.original.supplier.company}
                    userId={row.original.id.toString()}
                    disableNavigation={true}
                    disableHover
                  />
                </TableCell>
                <TableCell className={tableCellClass}>
                  {row.original.email}
                </TableCell>
                <TableCell className={tableCellClass}>
                  {row.original.phone || '-'}
                </TableCell>
                <TableCell className={tableCellClass}>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      row.original.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}
                  >
                    {row.original.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className={`text-right ${tableCellClass}`}>
                  <span className="font-mono">
                    {row.original.supplier.allocatedClaims}
                  </span>
                </TableCell>
              </TableRow>
            ))}
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
