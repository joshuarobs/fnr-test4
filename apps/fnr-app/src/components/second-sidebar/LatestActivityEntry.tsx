import { FileIcon } from 'lucide-react';
import { type Activity } from './placeholderLatestActivities';

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
          <img
            src={activity.user.avatar}
            alt={activity.user.name}
            className="h-6 w-6 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{truncatedName}</p>
            <p className="text-sm">{activity.action}</p>
            <p className="text-xs text-muted-foreground">
              {activity.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
