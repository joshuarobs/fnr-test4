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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[]
}

const SidebarSeparator = () => {
  return (
    <div className="py-3">
      <Separator />
    </div>
  );
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={cn('pb-12 max-w-[230px]', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* ======================================== */}
          {/* Main tabs */}
          {/* ======================================== */}
          <div className="space-y-0">
            <SidebarTab icon={<HomeIcon />} label="Homepage" />
            <SidebarTab icon={<StarIcon />} label="Assigned" />
            <SidebarSeparator />
          </div>
          {/* ======================================== */}
          {/* Assigned */}
          {/* ======================================== */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Assigned
          </h2>
          <div className="space-y-0">
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
          </div>
          <SidebarSeparator />
          {/* ======================================== */}
          {/* Previous */}
          {/* ======================================== */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Previous
          </h2>
          <div className="space-y-0">
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
            <SidebarTab icon={<FileTextIcon />} label="NRA245279610" />
          </div>
          <SidebarSeparator />
          {/* ======================================== */}
          {/* Other tabs */}
          {/* ======================================== */}
          <div className="space-y-0">
            <SidebarTab icon={<GearIcon />} label="Settings" />
            <SidebarTab icon={<MagicWandIcon />} label="Send feedback" />
          </div>
          <SidebarSeparator />
          {/* ======================================== */}
          {/* Other tabs */}
          {/* ======================================== */}
          <div className="space-y-0 mx-4">
            <p className="text-sm text-muted-foreground">© 2024 Company</p>
          </div>
        </div>
      </div>
    </div>
  );
};
