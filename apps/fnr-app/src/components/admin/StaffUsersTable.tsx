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
import { NavAvatar } from '../contents-other/NavAvatar';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

// Define the User type based on what we need from BaseUser
import { User } from '../../store/services/api';

/**
 * StaffUsersTable displays a paginated table of staff users with their details
 * including role, status, and activity information
 */
interface StaffUsersTableProps {
  users?: User[];
}

/**
 * StaffUsersTable component that shows staff user information in a paginated table format
 */
export const StaffUsersTable = ({ users = [] }: StaffUsersTableProps) => {
  const navigate = useNavigate();
  const tableCellClass = 'px-4';

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorFn: (row) => row.id,
      },
      {
        id: 'employeeId',
        header: 'Employee ID',
        accessorFn: (row) => row.staff?.employeeId || '-',
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
            userId={row.original.id.toString()}
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
        id: 'handledClaims',
        header: 'Handled Claims',
        accessorFn: (row) => row.handledClaims?.length || 0,
      },
      {
        id: 'contributedClaims',
        header: 'Contributed Claims',
        accessorFn: (row) => row.contributedClaims?.length || 0,
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
              <TableHead className={`text-right ${tableCellClass}`}>
                ID
              </TableHead>
              <TableHead className={`text-right ${tableCellClass}`}>
                Employee ID
              </TableHead>
              <TableHead className={tableCellClass}>User</TableHead>
              <TableHead className={tableCellClass}>Email</TableHead>
              <TableHead className={tableCellClass}>Role</TableHead>
              <TableHead className={tableCellClass}>Status</TableHead>
              <TableHead className={tableCellClass}>Last Login</TableHead>
              <TableHead className={`text-right ${tableCellClass}`}>
                Handled Claims
              </TableHead>
              <TableHead className={`text-right ${tableCellClass}`}>
                Contributed Claims
              </TableHead>
              <TableHead className={tableCellClass}>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.map((row) => (
              <TableRow
                key={row.original.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
              >
                {row.original.staff && row.original.staff.employeeId ? (
                  <a
                    href={`/staff/${row.original.staff.employeeId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (row.original.staff) {
                        navigate(`/staff/${row.original.staff.employeeId}`);
                      }
                    }}
                    className="contents"
                  >
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.id}
                    </TableCell>
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.staff?.employeeId || '-'}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      <NavAvatar
                        userInitials={`${row.original.firstName[0]}${row.original.lastName[0]}`}
                        color={row.original.avatarColour}
                        name={`${row.original.firstName} ${row.original.lastName}`}
                        userId={row.original.id.toString()}
                        disableNavigation={true}
                        disableHover
                      />
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {row.original.email}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      <span className="rounded-full px-2 py-1 text-xs font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {row.original.role.toLowerCase()}
                      </span>
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
                    <TableCell className={tableCellClass}>
                      {row.original.lastLogin
                        ? formatDistanceToNow(
                            new Date(row.original.lastLogin),
                            {
                              addSuffix: true,
                            }
                          )
                        : 'Never'}
                    </TableCell>
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.handledClaims?.length || 0}
                    </TableCell>
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.contributedClaims?.length || 0}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {formatDistanceToNow(new Date(row.original.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </a>
                ) : (
                  <div className="contents">
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.id}
                    </TableCell>
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.staff?.employeeId || '-'}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      <NavAvatar
                        userInitials={`${row.original.firstName[0]}${row.original.lastName[0]}`}
                        color={row.original.avatarColour}
                        name={`${row.original.firstName} ${row.original.lastName}`}
                        userId={row.original.id.toString()}
                        disableNavigation={true}
                      />
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {row.original.email}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      <span className="rounded-full px-2 py-1 text-xs font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {row.original.role.toLowerCase()}
                      </span>
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
                    <TableCell className={tableCellClass}>
                      {row.original.lastLogin
                        ? formatDistanceToNow(
                            new Date(row.original.lastLogin),
                            {
                              addSuffix: true,
                            }
                          )
                        : 'Never'}
                    </TableCell>
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.handledClaims?.length || 0}
                    </TableCell>
                    <TableCell className={`text-right ${tableCellClass}`}>
                      {row.original.contributedClaims?.length || 0}
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      {formatDistanceToNow(new Date(row.original.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </div>
                )}
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
