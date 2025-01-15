import React from 'react';
import { useGetRecentlyViewedClaimsQuery } from '../../store/services/api';
import { RecentClaimsList } from './RecentClaimsList';

/**
 * Displays the 5 most recently viewed claims by the current user
 */
export const RecentViewedClaims = () => {
  const { data, isLoading } = useGetRecentlyViewedClaimsQuery();

  return (
    <RecentClaimsList
      claims={data?.claims.slice(0, 5)}
      isLoading={isLoading}
      emptyMessage="No recently viewed claims"
    />
  );
};
