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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (to) {
      navigate(to);
    }
  };

  const button = (
    <Button
      variant={variant}
      className="w-full justify-start"
      onClick={handleClick}
    >
      {wrappedIcon}
      {label}
    </Button>
  );

  if (!to) return button;

  return (
    <a href={to} onClick={handleClick} className="block">
      {button}
    </a>
  );
};
