import React from 'react';
import { useUser, useUserLoading } from '../providers/UserContext';
import { useGetAssignedClaimsQuery } from '../../store/services/api';
import { RecentClaimsList } from './RecentClaimsList';

/**
 * Displays the 5 most recent claims assigned to the current user
 */
export const RecentAssignedClaims = () => {
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

  return (
    <RecentClaimsList
      claims={claims}
      isLoading={isUserLoading || isClaimsLoading}
      emptyMessage="No assigned claims"
    />
  );
};
