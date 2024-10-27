import { Button, ScrollArea, Separator } from '@react-monorepo/shared';
import { placeholderLatestActivities } from './placeholderLatestActivities';
import { LatestActivityCard } from './LatestActivityCard';

export const LatestActivitiesContainer = () => {
  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Latest activity</h2>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        <div>
          {placeholderLatestActivities.map((activity) => (
            <LatestActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </ScrollArea>
      <Separator className="mt-4" />
    </div>
  );
};
