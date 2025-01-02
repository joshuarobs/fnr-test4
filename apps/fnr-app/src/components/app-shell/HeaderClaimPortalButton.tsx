import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@react-monorepo/shared';
import { ROUTES } from '../../routes';

// Similar to HeaderAdminButton but navigates to the main claims portal
export const HeaderClaimPortalButton = () => {
  return (
    <NavLink to={ROUTES.HOME}>
      <Button variant="outline" className="text-sm">
        To claims portal
      </Button>
    </NavLink>
  );
};
