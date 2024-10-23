import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { SidebarTab } from './SidebarTab';
import { Separator } from '@react-monorepo/shared';

import {
  InfoCircledIcon,
  ChatBubbleIcon,
  ClockIcon,
  PersonIcon,
  BellIcon,
} from '@radix-ui/react-icons';

interface SecondSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarSeparator = () => {
  return (
    <div className="py-3">
      <Separator />
    </div>
  );
};

export const SecondSidebar = ({ className }: SecondSidebarProps) => {
  return (
    <div className={cn('pb-12 max-w-[224px] border-l', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* ======================================== */}
          {/* Item Details */}
          {/* ======================================== */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Item Details
          </h2>
          <div className="space-y-0">
            <SidebarTab icon={<InfoCircledIcon />} label="Overview" />
            <SidebarTab icon={<ChatBubbleIcon />} label="Notes" />
            <SidebarTab icon={<ClockIcon />} label="History" />
          </div>
          <SidebarSeparator />
          {/* ======================================== */}
          {/* Activity */}
          {/* ======================================== */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Activity
          </h2>
          <div className="space-y-0">
            <SidebarTab icon={<PersonIcon />} label="Assigned Users" />
            <SidebarTab icon={<BellIcon />} label="Notifications" />
          </div>
          <SidebarSeparator />
          {/* ======================================== */}
          {/* Stats */}
          {/* ======================================== */}
          <div className="px-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
              <p className="text-sm font-medium mt-4">Status</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
