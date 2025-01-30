import { ScrollArea } from '@react-monorepo/shared';
import { AllActivitiesDialog } from './AllActivitiesDialog';
import { LatestActivityEntry } from './LatestActivityEntry';
import { Activity } from '../../store/services/api';

interface LatestActivitiesContainerProps {
  activities: Activity[];
  isLoading?: boolean;
  currentClaimNumber?: string;
}

export const LatestActivitiesContainer = ({
  activities,
  isLoading,
  currentClaimNumber,
}: LatestActivitiesContainerProps) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Latest activity</h2>
        <AllActivitiesDialog />
      </div>

      <ScrollArea className="flex-1 -mr-2">
        <div>
          {/* Show loading state */}
          {isLoading && (
            <p className="text-sm text-muted-foreground p-3">
              Loading activities...
            </p>
          )}

          {/* Show activities */}
          {activities.map((activity) => (
            <LatestActivityEntry
              key={activity.id}
              activity={activity}
              currentClaimNumber={currentClaimNumber}
            />
          ))}

          {/* Show empty state */}
          {activities.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground p-3">
              No activities yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
