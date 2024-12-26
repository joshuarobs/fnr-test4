import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { Separator } from '@react-monorepo/shared';
import { LatestActivitiesContainer } from '../second-sidebar/LatestActivitiesContainer';
import { PartyAvatarSection } from '../contents-other/PartyAvatarSection';
import { ClaimAssignedToSection } from '../contents-other/ClaimAssignedToSection';

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
            assignedUser={{
              userInitials: 'JD',
              color: 'bg-blue-600',
              name: 'John Doe',
            }}
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
            <PartyAvatarSection
              title="Contributors"
              avatars={[
                { userInitials: 'P1', color: 'bg-blue-600', name: 'Person 1' },
                {
                  userInitials: 'P2',
                  color: 'bg-purple-600',
                  name: 'Person 2',
                },
                {
                  userInitials: 'P3',
                  color: 'bg-orange-600',
                  name: 'Person 3',
                },
              ]}
            />
            {/* ======================================== */}
            {/* Suppliers Section */}
            {/* ======================================== */}
            <PartyAvatarSection
              title="Suppliers"
              avatars={[
                {
                  userInitials: 'S1',
                  color: 'bg-emerald-600',
                  name: 'Supplier 1',
                },
                {
                  userInitials: 'S2',
                  color: 'bg-rose-600',
                  name: 'Supplier 2',
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
