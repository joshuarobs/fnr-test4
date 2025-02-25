import React from 'react';
import { useRecentlyViewedClaims } from '../providers/UserContext';
import { RecentClaimsList } from './RecentClaimsList';

/**
 * Displays the 5 most recently viewed claims by the current user
 * Data is loaded as part of the app shell query
 */
export const RecentViewedClaims = () => {
  const { claims, isLoading } = useRecentlyViewedClaims();

  return (
    <RecentClaimsList
      claims={claims.map((rv) => rv.claim).slice(0, 5)}
      isLoading={isLoading}
      emptyMessage="No recently viewed claims"
    />
  );
};
