import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@react-monorepo/shared';
import { ChevronsUpDown } from 'lucide-react';
import { ROUTES } from '../../routes';
import { useIsAdminRoute } from '../../hooks/useIsAdminRoute';

// Combines HeaderClaimPortalButton and HeaderAdminButton into a single component
// that toggles between "Claims Portal" and "Admin Portal" based on the current route
export const HeaderPortalToggleButton = () => {
  const isAdminRoute = useIsAdminRoute();

  return (
    <NavLink to={isAdminRoute ? ROUTES.HOME : ROUTES.ADMIN_PORTAL}>
      <Button variant="outline" className="text-sm">
        {isAdminRoute ? 'Admin Portal' : 'Claims Portal'}
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    </NavLink>
  );
};
