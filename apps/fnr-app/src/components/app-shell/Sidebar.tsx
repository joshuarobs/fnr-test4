import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../../../../shared/src/lib/utils';
import { SidebarTab } from './SidebarTab';
import { Separator } from '@react-monorepo/shared';
import { ROUTES, getClaimRoute } from '../../routes';
import { useGetRecentlyViewedClaimsQuery } from '../../store/services/api';
import { RecentAssignedClaims } from './RecentAssignedClaims';
import { HeaderPortalToggleButton } from './HeaderPortalToggleButton';

import {
  HomeIcon,
  StarIcon,
  FileTextIcon,
  GearIcon,
  MagicWandIcon,
} from '@radix-ui/react-icons';
import { History } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarSeparator = () => {
  return (
    <div className="py-3">
      <Separator />
    </div>
  );
};

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const isOnClaimPage = location.pathname.startsWith('/claim/');

  console.error('Current path:', location.pathname);
  console.error('Is on claim page:', isOnClaimPage);

  // Fetch recently viewed claims
  const { data: recentViewsData, refetch } = useGetRecentlyViewedClaimsQuery();

  // Refetch when navigating to a non-claim page
  React.useEffect(() => {
    if (!isOnClaimPage) {
      refetch();
    }
  }, [isOnClaimPage, refetch]);

  // Get the 5 most recent claims
  const recentClaims = React.useMemo(() => {
    if (!recentViewsData?.claims) return [];
    return recentViewsData.claims.slice(0, 5);
  }, [recentViewsData]);

  return (
    <div className={cn('w-[224px] min-w-[224px] border-r h-full', className)}>
      <div className="space-y-4 py-4 h-full overflow-y-auto">
        <div className="px-3 py-2">
          {/* ======================================== */}
          {/* Portal Toggle */}
          {/* ======================================== */}
          <div className="mb-4">
            <HeaderPortalToggleButton fullWidth />
          </div>

          {/* Main tabs */}
          <div>
            <SidebarTab icon={<HomeIcon />} label="Homepage" to={ROUTES.HOME} />
            <SidebarTab
              icon={<StarIcon />}
              label="Assigned"
              to={ROUTES.ASSIGNED}
            />
            <SidebarTab
              icon={<History className="w-4 h-4" />}
              label="History"
              to={ROUTES.HISTORY}
            />
          </div>

          <SidebarSeparator />
          {/* Recent Assigned Claims */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Assigned
          </h2>
          <RecentAssignedClaims />

          <SidebarSeparator />
          {/* Recently Viewed Claims */}
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Recently Viewed
          </h2>
          <div>
            {recentClaims.map((recentClaim) => (
              <SidebarTab
                key={recentClaim.id}
                icon={<FileTextIcon />}
                label={recentClaim.claimNumber}
                to={getClaimRoute(recentClaim.claimNumber)}
              />
            ))}
            {recentClaims.length === 0 && (
              <p className="text-sm text-muted-foreground px-4">
                No recently viewed claims
              </p>
            )}
          </div>

          <SidebarSeparator />
          {/* Other tabs */}
          <div>
            <SidebarTab
              icon={<GearIcon />}
              label="Settings"
              to={ROUTES.SETTINGS}
            />
            <SidebarTab
              icon={<MagicWandIcon />}
              label="Send feedback"
              to={ROUTES.FEEDBACK}
            />
          </div>

          <SidebarSeparator />
          {/* Footer */}
          <div className="space-y-1 mx-4">
            <p className="text-sm text-muted-foreground">© 2024 Company</p>
          </div>
        </div>
      </div>
    </div>
  );
};
