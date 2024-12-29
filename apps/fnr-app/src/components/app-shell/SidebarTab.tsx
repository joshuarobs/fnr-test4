import React from 'react';
import { Button } from '@react-monorepo/shared';
import { useNavigate } from 'react-router-dom';

interface SidebarTabProps {
  icon: React.ReactNode;
  label: string;
  variant?: 'ghost' | 'secondary';
  to?: string;
}

export const SidebarTab = ({
  icon,
  label,
  variant = 'ghost',
  to,
}: SidebarTabProps) => {
  const navigate = useNavigate();
  const wrappedIcon = (
    <div className="mr-2 h-4 w-4 flex items-center justify-center">{icon}</div>
  );

  // Use anchor tag for hover preview but handle navigation through React Router
  const button = (
    <Button variant={variant} className="w-full justify-start" asChild>
      <a
        href={to}
        onClick={(e) => {
          e.preventDefault();
          if (to) {
            // Use replace instead of push to avoid duplicate history entries
            navigate(to, { replace: true });
          }
        }}
      >
        {wrappedIcon}
        {label}
      </a>
    </Button>
  );

  return button;
};
