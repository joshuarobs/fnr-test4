import { Button, ScrollArea, Separator } from '@react-monorepo/shared';
import { placeholderLatestActivities } from './placeholderLatestActivities';
import { LatestActivityCard } from './LatestActivityCard';

export const LatestActivitiesContainer = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Latest activity</h2>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </div>

        <ScrollArea className="flex-grow -mx-4">
          <div className="px-4">
            {placeholderLatestActivities.map((activity) => (
              <LatestActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </ScrollArea>
        <Separator className="mt-4" />
      </div>
    </div>
  );
};
