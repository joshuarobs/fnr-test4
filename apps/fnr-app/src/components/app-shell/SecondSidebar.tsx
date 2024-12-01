import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { SidebarTab } from './SidebarTab';
import { Separator } from '@react-monorepo/shared';
import { LatestActivitiesContainer } from '../second-sidebar/LatestActivitiesContainer';

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
    <div className={cn('pb-12 max-w-[280px]', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* ======================================== */}
          {/* Activity */}
          {/* ======================================== */}
          <LatestActivitiesContainer />
        </div>
      </div>
    </div>
  );
};
