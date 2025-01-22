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
}

export const LatestActivityEntry = ({ activity }: LatestActivityEntryProps) => {
  return (
    <div className="p-3 rounded-lg hover:bg-accent/50 transition-colors space-y-2">
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
      <div className="flex items-center gap-3">
        <FileIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{activity.action}</p>
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
