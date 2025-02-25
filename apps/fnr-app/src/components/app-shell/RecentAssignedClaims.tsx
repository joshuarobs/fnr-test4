import React from 'react';
import { useAssignedClaims } from '../providers/UserContext';
import { RecentClaimsList } from './RecentClaimsList';

/**
 * Displays the 5 most recent claims assigned to the current user
 * Data is loaded as part of the app shell query
 */
export const RecentAssignedClaims = () => {
  const { claims, isLoading } = useAssignedClaims();

  return (
    <RecentClaimsList
      claims={claims}
      isLoading={isLoading}
      emptyMessage="No assigned claims"
    />
  );
};
