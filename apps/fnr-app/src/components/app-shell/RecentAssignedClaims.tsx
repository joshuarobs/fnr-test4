import React from 'react';
import { useUser, useUserLoading } from '../providers/UserContext';
import { useGetAssignedClaimsQuery } from '../../store/services/api';
import { FileTextIcon } from '@radix-ui/react-icons';
import { SidebarTab } from './SidebarTab';
import { getClaimRoute } from '../../routes';

/**
 * Displays the 5 most recent claims assigned to the current user
 */
const RecentAssignedClaims = () => {
  const isUserLoading = useUserLoading();
  const user = useUser();
  const { data: claims, isLoading: isClaimsLoading } =
    useGetAssignedClaimsQuery(
      {
        employeeId: user.staff?.employeeId || '',
        limit: 5,
      },
      {
        skip: isUserLoading || !user.staff?.employeeId,
      }
    );

  // Show loading state while user data is being fetched
  if (isUserLoading) {
    return <div className="text-sm text-muted-foreground px-4">Loading...</div>;
  }

  if (isClaimsLoading) {
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
