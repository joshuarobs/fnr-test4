import React from 'react';
import { cn } from '../../../../../shared/src/lib/utils';
import { Button } from '@react-monorepo/shared';
import { HomeIcon, StarIcon } from '@radix-ui/react-icons';

interface ThinSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const ThinSidebarButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <Button
      variant="ghost"
      className="w-full h-auto py-2 flex flex-col items-center justify-center"
    >
      <div className="h-6 w-6 mb-1 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Button>
  );
};

export const ThinSidebar = ({ className }: ThinSidebarProps) => {
  return (
    <div className={cn('pb-12 w-[80px] border-r', className)}>
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <div className="space-y-1">
            <ThinSidebarButton icon={<HomeIcon />} label="Homepage" />
            <ThinSidebarButton icon={<StarIcon />} label="Assigned" />
          </div>
        </div>
      </div>
    </div>
  );
};
