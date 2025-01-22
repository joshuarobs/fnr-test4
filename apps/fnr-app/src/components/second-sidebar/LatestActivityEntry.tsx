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

interface LatestActivityEntryProps {
  activity: Activity;
  currentClaimNumber?: string;
}

export const LatestActivityEntry = ({
  activity,
  currentClaimNumber,
}: LatestActivityEntryProps) => {
  // Extract claim number from "Created claim X" action if present
  const getActionText = () => {
    if (!activity.action.startsWith('Created claim')) return activity.action;

    const match = activity.action.match(/Created claim (\w+)/);
    if (!match) return activity.action;

    const claimNumber = match[1];
    return claimNumber === currentClaimNumber
      ? 'Created this claim'
      : activity.action;
  };

  return (
    <div className="pt-3 pr-3 pb-3 rounded-lg hover:bg-accent/50 transition-colors space-y-1">
      <NavAvatar
        userInitials={getUserInitials(
          activity.user.firstName,
          activity.user.lastName
        )}
        name={activity.user.name}
        color={activity.user.avatarColour}
        userId={activity.user.employeeId}
        mini
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5">
          <FileIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{getActionText()}</p>
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
