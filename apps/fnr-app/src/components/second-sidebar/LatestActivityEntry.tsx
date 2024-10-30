import { FileIcon, CalendarDays } from 'lucide-react';
import { type Activity } from './placeholderLatestActivities';
import { formatDistance } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@react-monorepo/shared';

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
          <HoverCard>
            <HoverCardTrigger asChild>
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="h-6 w-6 rounded-full cursor-pointer"
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/vercel.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm">
                    The React Framework – created and maintained by @vercel.
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                    <span className="text-xs text-muted-foreground">
                      Joined December 2021
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="flex-1">
            <p className="text-sm font-medium">{truncatedName}</p>
            <p className="text-sm">{activity.action}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground">
                    {formatDistance(activity.timestamp, new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  {activity.timestamp.toLocaleString()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
