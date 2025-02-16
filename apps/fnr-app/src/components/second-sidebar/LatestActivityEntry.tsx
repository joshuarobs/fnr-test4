import { FileIcon } from 'lucide-react';
import { type Activity } from '../../store/services/api';
import { formatDistance, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@react-monorepo/shared';
import { NavAvatar } from '../contents-other/NavAvatar';
import { getUserInitials } from '../../lib/avatar-utils';
import { getActivityText } from '../../lib/activity-utils';

interface LatestActivityEntryProps {
  activity: Activity;
  currentClaimNumber?: string;
  /** If true, displays in a horizontal layout instead of vertical */
  wideVersion?: boolean;
}

export const LatestActivityEntry = ({
  activity,
  currentClaimNumber,
  wideVersion = false,
}: LatestActivityEntryProps) => {
  // Get formatted activity text using utility function
  const getActionText = () => {
    // Ensure metadata has required itemId field
    const metadata = {
      ...activity.metadata,
      itemId: activity.metadata?.itemId || 'unknown',
    };
    return getActivityText(activity.activityType, metadata, currentClaimNumber);
  };

  return (
    <div
      className={`pt-3 pr-3 pb-3 rounded-lg hover:bg-accent/50 transition-colors ${
        wideVersion ? 'flex items-center gap-4' : 'space-y-1'
      }`}
    >
      <NavAvatar
        userInitials={getUserInitials(
          activity.user.firstName,
          activity.user.lastName
        )}
        name={activity.user.name}
        color={activity.user.avatarColour}
        userId={activity.user.id}
        mini
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5">
          <FileIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          {activity.activityType.startsWith('ITEM_') && activity.metadata ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground">
                    {getActionText()}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 text-sm">
                    <p>Item Details:</p>
                    {activity.metadata.itemName && (
                      <p>Name: {activity.metadata.itemName}</p>
                    )}
                    {activity.metadata.category && (
                      <p>Category: {activity.metadata.category}</p>
                    )}
                    {activity.metadata.roomCategory && (
                      <p>Room: {activity.metadata.roomCategory}</p>
                    )}
                    {activity.metadata.quantity && (
                      <p>Quantity: {activity.metadata.quantity}</p>
                    )}
                    {activity.metadata.insuredsQuote && (
                      <p>Insured's Quote: ${activity.metadata.insuredsQuote}</p>
                    )}
                    {activity.metadata.ourQuote && (
                      <p>Our Quote: ${activity.metadata.ourQuote}</p>
                    )}
                    {activity.metadata.itemStatus && (
                      <p>Status: {activity.metadata.itemStatus}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <p className="text-sm text-muted-foreground">{getActionText()}</p>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground">
                  {/* Handle date transformation at component level for flexibility
                      This allows different components to format dates differently
                      while keeping the raw ISO string in the store */}
                  {formatDistance(new Date(activity.timestamp), new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                {`${format(new Date(activity.timestamp), 'dd-MM-yy')}, ${
                  new Date(activity.timestamp).toLocaleString().split(',')[1]
                }`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
