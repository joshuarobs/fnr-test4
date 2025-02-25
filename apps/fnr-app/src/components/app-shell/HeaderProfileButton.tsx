import React from 'react';
import { useUser, useUserLoading } from '../providers/UserContext';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
  toast,
} from '@react-monorepo/shared';
import { Settings, Bell, LogOut } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, getStaffRoute, getSupplierRoute } from '../../routes';
import { useLogoutMutation } from '../../store/services/api';

// Component for displaying staff profile dropdown in the header
// Uses UserAvatar component for avatar display and contains menu items for various actions
export const HeaderProfileButton = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const userData = useUser();
  const isLoading = useUserLoading();

  // Common props for UserAvatar to avoid duplication
  const avatarProps = {
    size: 'sm' as const,
    color: userData?.avatarColour || 'bg-blue-600',
    name:
      userData?.firstName && userData?.lastName
        ? `${userData.firstName} ${userData.lastName}`
        : undefined,
    userInitials:
      userData?.firstName && userData?.lastName
        ? `${userData.firstName[0]}${userData.lastName[0]}`
        : 'JD',
    department: userData?.staff?.department,
  };

  const getProfileRoute = () => {
    if (userData.role === 'SUPPLIER') {
      return getSupplierRoute(userData.id.toString());
    } else if (userData.role === 'STAFF' || userData.role === 'ADMIN') {
      return getStaffRoute(userData.staff?.employeeId || '');
    }
    return '';
  };

  const getPositionText = () => {
    if (userData.role === 'SUPPLIER') {
      return userData.supplier?.company;
    } else if (userData.staff?.position) {
      return userData.staff.position.toUpperCase();
    }
    return userData.role;
  };

  const getIdText = () => {
    if (userData.role === 'SUPPLIER') {
      return `Supplier ID: ${userData.id.toString()}`;
    } else if (userData.staff?.employeeId) {
      return userData.staff.employeeId;
    }
    return `User ID: ${userData.id}`;
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
          <Link to={getProfileRoute()} className="flex w-full p-2">
            <div className="flex items-center justify-start gap-2">
              <UserAvatar {...avatarProps} hoverable={false} />
              <div className="flex flex-col">
                {isLoading ? (
                  <span className="text-sm font-medium">Loading...</span>
                ) : (
                  <>
                    <span className="text-sm font-medium">
                      {`${userData.firstName} ${userData.lastName}`}
                    </span>
                    <span className="text-sm truncate max-w-[160px]">
                      {getPositionText()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getIdText()}
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
          onClick={() => {
            navigate(ROUTES.LOGOUT);
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
