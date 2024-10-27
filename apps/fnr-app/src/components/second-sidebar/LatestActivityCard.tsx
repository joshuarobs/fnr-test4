import { FileIcon } from 'lucide-react';
import { type Activity } from './placeholderLatestActivities';

interface LatestActivityCardProps {
  activity: Activity;
}

export const LatestActivityCard = ({ activity }: LatestActivityCardProps) => (
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
          <p className="text-sm">
            <span className="font-medium">{activity.user.name}:</span>{' '}
            {activity.action}
          </p>
          <p className="text-xs text-muted-foreground">
            {activity.timestamp.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);
