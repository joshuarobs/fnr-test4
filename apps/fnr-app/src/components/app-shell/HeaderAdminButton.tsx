import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@react-monorepo/shared';
import { ROUTES } from '../../routes';

export const HeaderAdminButton = () => {
  return (
    <NavLink to={ROUTES.ADMIN_PORTAL}>
      <Button variant="outline" className="text-sm">
        To admin portal
      </Button>
    </NavLink>
  );
};
