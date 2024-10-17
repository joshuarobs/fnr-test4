import React from 'react';
import { Button } from '@react-monorepo/shared';

interface SidebarTabProps {
  icon: React.ReactNode;
  label: string;
  variant?: 'ghost' | 'secondary';
}

export const SidebarTab = ({
  icon,
  label,
  variant = 'ghost',
}: SidebarTabProps) => {
  const wrappedIcon = (
    <div className="mr-2 h-4 w-4 flex items-center justify-center">{icon}</div>
  );

  return (
    <Button variant={variant} className="w-full justify-start">
      {wrappedIcon}
      {label}
    </Button>
  );
};
