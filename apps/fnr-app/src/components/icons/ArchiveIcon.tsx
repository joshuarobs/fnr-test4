import { Archive } from 'lucide-react';

/**
 * ArchiveIcon - A reusable icon component for archive/unarchive actions
 * Wraps the lucide-react Archive icon for consistent usage across the application
 */
export const ArchiveIcon = ({ className = 'h-4 w-4' }) => {
  return <Archive className={className} />;
};
