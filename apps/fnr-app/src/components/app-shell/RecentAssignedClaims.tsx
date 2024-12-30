import React from 'react';
import { useUser } from '../providers/UserContext';
import { useGetAssignedClaimsQuery } from '../../store/services/api';
import { FileTextIcon } from '@radix-ui/react-icons';
import { SidebarTab } from './SidebarTab';
import { getClaimRoute } from '../../routes';

/**
 * Displays the 5 most recent claims assigned to the current user
 */
const RecentAssignedClaims = () => {
  const user = useUser();
  const { data: claims, isLoading } = useGetAssignedClaimsQuery({
    employeeId: user.employeeId,
    limit: 5,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground px-4">Loading...</div>;
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-4">
        No assigned claims
      </div>
    );
  }

  const recentClaims = claims || [];

  return (
    <div>
      {recentClaims.map((claim) => (
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

export { RecentAssignedClaims };
