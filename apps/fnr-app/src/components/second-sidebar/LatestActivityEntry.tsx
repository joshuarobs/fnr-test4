import { FileIcon } from 'lucide-react';
import { type Activity } from '../../store/services/api';
import { formatDistance } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@react-monorepo/shared';
import { UserAvatar } from '../app-shell/UserAvatar';

const NAME_TRUNCATION_LENGTH = 20;

interface LatestActivityEntryProps {
  activity: Activity;
}

export const LatestActivityEntry = ({ activity }: LatestActivityEntryProps) => {
  const truncatedName =
    activity.user.name.length > NAME_TRUNCATION_LENGTH
      ? `${activity.user.name.slice(0, NAME_TRUNCATION_LENGTH)}...`
      : activity.user.name;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <FileIcon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <UserAvatar
            imageUrl={activity.user.avatar}
            name={activity.user.name}
            userInitials={activity.user.name[0]}
            hoverable={true}
            showHeaderRing
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{truncatedName}</p>
            <p className="text-sm">{activity.action}</p>
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
                  {new Date(activity.timestamp).toLocaleString()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
