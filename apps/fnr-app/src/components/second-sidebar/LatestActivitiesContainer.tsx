import { Button, ScrollArea, Separator } from '@react-monorepo/shared';
import { placeholderLatestActivities } from './placeholderLatestActivities';
import { LatestActivityEntry } from './LatestActivityEntry';
import { TestApi } from './TestApi';

export const LatestActivitiesContainer = () => {
  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Latest activity</h2>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        <div>
          {placeholderLatestActivities.map((activity) => (
            <LatestActivityEntry key={activity.id} activity={activity} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
