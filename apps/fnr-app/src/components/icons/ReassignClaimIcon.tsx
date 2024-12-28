import { UserCog } from 'lucide-react';

/**
 * ReassignClaimIcon - A reusable icon component for claim reassignment actions
 * Wraps the lucide-react UserCog icon for consistent usage across the application
 */
export const ReassignClaimIcon = ({ className = 'h-4 w-4' }) => {
  return <UserCog className={className} />;
};
