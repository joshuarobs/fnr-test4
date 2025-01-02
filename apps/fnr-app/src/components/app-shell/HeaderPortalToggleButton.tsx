import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@react-monorepo/shared';
import { ChevronsUpDown, MonitorCog, Sheet } from 'lucide-react';
import { ROUTES } from '../../routes';
import { useIsAdminRoute } from '../../hooks/useIsAdminRoute';

interface HeaderPortalToggleButtonProps {
  fullWidth?: boolean;
}

// Combines HeaderClaimPortalButton and HeaderAdminButton into a single component
// that toggles between "Claims Portal" and "Admin Portal" based on the current route
export const HeaderPortalToggleButton = ({
  fullWidth = false,
}: HeaderPortalToggleButtonProps) => {
  const isAdminRoute = useIsAdminRoute();

  return (
    <NavLink
      to={isAdminRoute ? ROUTES.HOME : ROUTES.ADMIN_PORTAL}
      className={fullWidth ? 'w-full block' : undefined}
    >
      <Button
        variant="outline"
        className={`text-sm ${
          fullWidth ? 'w-full justify-between' : ''
        } flex items-center`}
      >
        <div className="flex items-center gap-2">
          {isAdminRoute ? (
            <MonitorCog className="h-4 w-4" />
          ) : (
            <Sheet className="h-4 w-4" />
          )}
          <span className="leading-none">
            {isAdminRoute ? 'Admin Portal' : 'Claims Portal'}
          </span>
        </div>
        <ChevronsUpDown className={fullWidth ? 'h-4 w-4' : 'ml-2 h-4 w-4'} />
      </Button>
    </NavLink>
  );
};
