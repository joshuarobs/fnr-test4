import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { Separator } from '@react-monorepo/shared';
import { HeaderPortalToggleButton } from './HeaderPortalToggleButton';
import { LatestActivitiesContainer } from '../second-sidebar/LatestActivitiesContainer';
import { PartyAvatarSection } from '../contents-other/PartyAvatarSection';
import { ClaimAssignedToSection } from '../contents-other/ClaimAssignedToSection';

interface SecondSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  assignedUser?: {
    userInitials: string;
    color?: string;
    name: string;
    userId: string;
  };
  contributors?: {
    userInitials: string;
    color?: string;
    name: string;
    userId: string;
  }[];
}

const SidebarSeparator = () => {
  return (
    <div className="py-3">
      <Separator />
    </div>
  );
};

export const SecondSidebar = ({
  className,
  assignedUser,
  contributors = [],
}: SecondSidebarProps) => {
  return (
    <div
      className={cn(
        'max-w-[280px] h-[calc(100vh-56px)] overflow-hidden',
        className
      )}
    >
      <div className="h-full flex flex-col py-4">
        <div className="px-3 py-2 flex flex-col flex-1">
          {/* ======================================== */}
          {/* Assigned To Section */}
          {/* ======================================== */}
          <ClaimAssignedToSection
            assignedUser={assignedUser}
            onAssignClick={() => {
              // TODO: Implement assign click handler
              console.log('Assign clicked');
            }}
          />
          <SidebarSeparator />

          {/* ======================================== */}
          {/* Contributors Section */}
          {/* ======================================== */}
          <div className="flex flex-col gap-4">
            <PartyAvatarSection title="Contributors" avatars={contributors} />
            {/* ======================================== */}
            {/* Suppliers Section */}
            {/* ======================================== */}
            <PartyAvatarSection
              title="Suppliers"
              avatars={[
                {
                  userInitials: 'S1',
                  color: '#059669', // emerald-600
                  name: 'Supplier 1',
                  userId: 'S1123',
                },
                {
                  userInitials: 'S2',
                  color: '#E11D48', // rose-600
                  name: 'Supplier 2',
                  userId: 'S2123',
                },
              ]}
            />
          </div>
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
