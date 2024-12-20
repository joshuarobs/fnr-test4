import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { SidebarTab } from './SidebarTab';
import { Separator } from '@react-monorepo/shared';
import { LatestActivitiesContainer } from '../second-sidebar/LatestActivitiesContainer';
import { PartyAvatarSection } from '../contents-other/PartyAvatarSection';

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
          {/* Contributors Section */}
          {/* ======================================== */}
          <PartyAvatarSection
            title="Contributors"
            avatars={[
              { userInitials: 'P1', color: 'bg-blue-600' },
              { userInitials: 'P2', color: 'bg-purple-600' },
              { userInitials: 'P3', color: 'bg-orange-600' },
            ]}
          />
          {/* ======================================== */}
          {/* Suppliers Section */}
          {/* ======================================== */}
          <PartyAvatarSection
            title="Suppliers"
            avatars={[
              { userInitials: 'S1', color: 'bg-emerald-600' },
              { userInitials: 'S2', color: 'bg-rose-600' },
            ]}
          />
          <SidebarSeparator />
          {/* ======================================== */}
          {/* Activity */}
          {/* ======================================== */}
          <LatestActivitiesContainer />
        </div>
      </div>
    </div>
  );
};
