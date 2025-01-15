import React from 'react';
import { useGetStaffQuery } from '../../store/services/api';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@react-monorepo/shared';
import { Settings, Bell, LogOut } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, getStaffRoute } from '../../routes';
import { useLogoutMutation } from '../../store/services/api';

// Component for displaying staff profile dropdown in the header
// Uses UserAvatar component for avatar display and contains menu items for various actions
export const HeaderProfileButton = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const employeeId = 'ADM001'; // Admin user from seed data. TODO: Get this from auth context when implemented
  const { data: staffData, isLoading } = useGetStaffQuery(employeeId);

  // Common props for UserAvatar to avoid duplication
  const avatarProps = {
    size: 'sm' as const,
    color: staffData?.avatarColour || 'bg-blue-600',
    name: staffData
      ? `${staffData.firstName} ${staffData.lastName}`
      : undefined,
    userInitials: staffData
      ? `${staffData.firstName[0]}${staffData.lastName[0]}`
      : 'JD',
    department: staffData?.staff.department,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 hover:cursor-pointer hover:bg-transparent focus-visible:ring-2"
        >
          <UserAvatar {...avatarProps} showHeaderRing hoverable={false} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="cursor-pointer p-0" asChild>
          <Link to={getStaffRoute(employeeId)} className="flex w-full p-2">
            <div className="flex items-center justify-start gap-2">
              <UserAvatar {...avatarProps} hoverable={false} />
              <div className="flex flex-col">
                {isLoading ? (
                  <span className="text-sm font-medium">Loading...</span>
                ) : (
                  <>
                    <span className="text-sm font-medium">
                      {`${staffData?.firstName} ${staffData?.lastName}`}
                    </span>
                    <span className="text-sm truncate max-w-[160px]">
                      {staffData?.staff.position.toUpperCase()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {staffData?.staff.employeeId}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        <Separator className="my-2" />
        <DropdownMenuItem className="cursor-pointer gap-2" asChild>
          <Link to={ROUTES.SETTINGS} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </DropdownMenuItem>
        <Separator className="my-2" />
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={async () => {
            await logout();
            localStorage.removeItem('token');
            navigate(ROUTES.LOGIN);
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
