import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { SidebarTab } from './SidebarTab';
import { Separator } from '@react-monorepo/shared';

import {
  HomeIcon,
  StarIcon,
  FileTextIcon,
  GearIcon,
  MagicWandIcon,
} from '@radix-ui/react-icons';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarSeparator = () => {
  return (
    <div className="py-3">
      <Separator />
    </div>
  );
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={cn('pb-12 w-[224px] border-r', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* Main tabs */}
          <div>
            <SidebarTab icon={<HomeIcon />} label="Homepage" />
            <SidebarTab icon={<StarIcon />} label="Assigned" />
          </div>

          <SidebarSeparator />
          {/* Assigned */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Assigned
          </h2>
          <div>
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
          </div>

          <SidebarSeparator />
          {/* Previous */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Previous
          </h2>
          <div>
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
          </div>

          <SidebarSeparator />
          {/* Other tabs */}
          <div>
            <SidebarTab icon={<GearIcon />} label="Settings" />
            <SidebarTab icon={<MagicWandIcon />} label="Send feedback" />
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
