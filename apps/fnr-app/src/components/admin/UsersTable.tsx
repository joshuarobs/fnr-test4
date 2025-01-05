import React from 'react';
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
import { NavAvatar } from '../contents-other/NavAvatar';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

// Define the User type based on what we need from BaseUser
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STAFF' | 'ADMIN' | 'SUPPLIER' | 'INSURED';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  avatarColour?: string;
}

/**
 * UsersTable displays a paginated table of all users with their details
 * including role, status, and activity information
 */
interface UsersTableProps {
  users?: User[];
}

/**
 * UsersTable component that shows user information in a paginated table format
 */
export const UsersTable = ({ users = [] }: UsersTableProps) => {
  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorFn: (row) => row.id,
      },
      {
        id: 'user',
        header: 'User',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <NavAvatar
            userInitials={`${row.original.firstName[0]}${row.original.lastName[0]}`}
            color={row.original.avatarColour}
            name={`${row.original.firstName} ${row.original.lastName}`}
          />
        ),
      },
      {
        id: 'email',
        header: 'Email',
        accessorFn: (row) => row.email,
      },
      {
        id: 'role',
        header: 'Role',
        accessorFn: (row) => row.role,
        cell: ({ getValue }) => (
          <span className="rounded-full px-2 py-1 text-xs font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {getValue<string>().toLowerCase()}
          </span>
        ),
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
        id: 'lastLogin',
        header: 'Last Login',
        accessorFn: (row) => row.lastLogin,
        cell: ({ getValue }) => {
          const lastLogin = getValue<string | null>();
          return lastLogin
            ? formatDistanceToNow(new Date(lastLogin), { addSuffix: true })
            : 'Never';
        },
      },
      {
        id: 'createdAt',
        header: 'Created',
        accessorFn: (row) => row.createdAt,
        cell: ({ getValue }) =>
          formatDistanceToNow(new Date(getValue<string>()), {
            addSuffix: true,
          }),
      },
    ],
    []
  );

  const table = useReactTable<User>({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    filterFns: {
      fuzzy: (() => true) as FilterFn<User>,
      faceted: (() => true) as FilterFn<User>,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.map((row) => (
              <TableRow
                key={row.original.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="text-right">{row.original.id}</TableCell>
                <TableCell>
                  <NavAvatar
                    userInitials={`${row.original.firstName[0]}${row.original.lastName[0]}`}
                    color={row.original.avatarColour}
                    name={`${row.original.firstName} ${row.original.lastName}`}
                  />
                </TableCell>
                <TableCell>{row.original.email}</TableCell>
                <TableCell>
                  <span className="rounded-full px-2 py-1 text-xs font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {row.original.role.toLowerCase()}
                  </span>
                </TableCell>
                <TableCell>
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
                <TableCell>
                  {row.original.lastLogin
                    ? formatDistanceToNow(new Date(row.original.lastLogin), {
                        addSuffix: true,
                      })
                    : 'Never'}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(row.original.createdAt), {
                    addSuffix: true,
                  })}
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
