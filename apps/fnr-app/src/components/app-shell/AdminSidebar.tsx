import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { SidebarTab } from './SidebarTab';
import { Separator } from '@react-monorepo/shared';
import { HeaderPortalToggleButton } from './HeaderPortalToggleButton';
import {
  DashboardIcon,
  PersonIcon,
  HomeIcon,
  RocketIcon,
  BarChartIcon,
  GearIcon,
} from '@radix-ui/react-icons';

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarSeparator = () => {
  return (
    <div className="py-3">
      <Separator />
    </div>
  );
};

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  return (
    <div className={cn('pb-12 w-[224px] min-w-[224px] border-r', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* ======================================== */}
          {/* Portal Toggle */}
          {/* ======================================== */}
          <div className="mb-4">
            <HeaderPortalToggleButton fullWidth />
          </div>

          {/* Main tabs */}
          <div>
            <SidebarTab
              icon={<DashboardIcon />}
              label="Dashboard"
              to="/admin"
            />
            <SidebarTab icon={<PersonIcon />} label="Users" to="/admin/users" />
            <SidebarTab
              icon={<HomeIcon />}
              label="Customers"
              to="/admin/customers"
            />
            <SidebarTab
              icon={<RocketIcon />}
              label="Suppliers"
              to="/admin/suppliers"
            />
            <SidebarTab
              icon={<BarChartIcon />}
              label="Analytics"
              to="/admin/analytics"
            />
          </div>

          <SidebarSeparator />

          {/* Settings */}
          <div>
            <SidebarTab
              icon={<GearIcon />}
              label="Settings"
              to="/admin/settings"
            />
          </div>

          <SidebarSeparator />
          {/* Footer */}
          <div className="space-y-1 mx-4">
            <p className="text-sm text-muted-foreground">© 2024 Company</p>
          </div>
        </div>
      </div>
    </div>
  );
};
