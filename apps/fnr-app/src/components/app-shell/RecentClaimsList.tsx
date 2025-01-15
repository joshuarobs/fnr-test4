import React from 'react';
import { FileTextIcon } from '@radix-ui/react-icons';
import { SidebarTab } from './SidebarTab';
import { getClaimRoute } from '../../routes';
import { ClaimOverview } from '../../store/services/api';

interface RecentClaimsListProps {
  claims?: ClaimOverview[];
  isLoading: boolean;
  emptyMessage?: string;
}

/**
 * Reusable component to display a list of recent claims in the sidebar
 * Can be used for both assigned claims and recently viewed claims
 */
export const RecentClaimsList: React.FC<RecentClaimsListProps> = ({
  claims,
  isLoading,
  emptyMessage = 'No claims',
}) => {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground px-4">Loading...</div>;
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-4">{emptyMessage}</div>
    );
  }

  return (
    <div>
      {claims.map((claim) => (
        <SidebarTab
          key={claim.id}
          icon={<FileTextIcon />}
          label={claim.claimNumber}
          to={getClaimRoute(claim.claimNumber)}
        />
      ))}
    </div>
  );
};
