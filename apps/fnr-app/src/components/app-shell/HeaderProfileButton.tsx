import React from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@react-monorepo/shared';
import { Settings, Bell, LogOut } from 'lucide-react';
import { ProfileIcon } from './ProfileIcon';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../routes';

// Component for displaying profile dropdown in the header
// Uses ProfileIcon component for avatar display and contains menu items for various actions
export const HeaderProfileButton = () => {
  const color = 'bg-blue-600';
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 hover:cursor-pointer hover:bg-transparent focus-visible:ring-2"
        >
          <ProfileIcon size="sm" color={color} showHeaderRing />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <ProfileIcon size="sm" color={color} />
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-sm">AGENT (748600)</span>
          </div>
        </div>
        <Separator className="my-2" />
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => navigate(ROUTES.SETTINGS)}
          asChild
        >
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
        <DropdownMenuItem className="cursor-pointer gap-2">
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
