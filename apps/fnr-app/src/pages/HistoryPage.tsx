import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';
import { useGetRecentlyViewedClaimsQuery } from '../store/services/api';
import type { ClaimOverview } from '../store/services/api';

// This page shows all the claims the user has visited
export const HistoryPage = () => {
  const { data: recentlyViewedClaims = [] } = useGetRecentlyViewedClaimsQuery();

  // Transform RecentlyViewedClaim[] to ClaimOverview[]
  const claims: ClaimOverview[] = recentlyViewedClaims.map((recentClaim) => ({
    id: recentClaim.id,
    claimNumber: recentClaim.claim.claimNumber,
    description: recentClaim.claim.description,
    status: recentClaim.claim.status,
    items: [], // We don't have items in the recent view data
    totalClaimed: recentClaim.claim.totalClaimed,
    totalApproved: recentClaim.claim.totalApproved,
    createdAt: recentClaim.claim.createdAt,
    updatedAt: recentClaim.claim.updatedAt,
    insuredProgressPercent: 0, // These fields aren't in recent view data
    ourProgressPercent: 0,
    lastProgressUpdate: null,
    isDeleted: false,
    handler: recentClaim.claim.handler,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">History</h1>
      <p className="text-muted-foreground mb-4">
        Your recently visited claims will appear here.
      </p>
      <DetailedClaimsTable claims={claims} />
    </div>
  );
};

export default HistoryPage;
