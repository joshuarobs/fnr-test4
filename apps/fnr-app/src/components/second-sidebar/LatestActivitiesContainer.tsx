import { ScrollArea } from '@react-monorepo/shared';
import { AllActivitiesDialog } from './AllActivitiesDialog';
import { LatestActivityEntry } from './LatestActivityEntry';
import { useGetClaimActivitiesQuery } from '../../store/services/api';
import { useParams } from 'react-router-dom';

export const LatestActivitiesContainer = () => {
  const { id: claimId } = useParams();

  const { data, isLoading, error } = useGetClaimActivitiesQuery(
    { claimNumber: claimId || '', pageSize: 6, page: 1 },
    { skip: !claimId }
  );

  console.log('LatestActivitiesContainer state:', {
    claimId,
    data,
    isLoading,
    error,
    hasData: !!data,
    dataLength: data?.activities.length,
  });

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

          {/* Show error state */}
          {error && (
            <p className="text-sm text-destructive p-3">
              Failed to load activities. Please try again later.
            </p>
          )}

          {/* Show activities */}
          {data?.activities.map((activity) => (
            <LatestActivityEntry
              key={activity.id}
              activity={activity}
              currentClaimNumber={claimId}
            />
          ))}

          {/* Show empty state */}
          {data?.activities.length === 0 && (
            <p className="text-sm text-muted-foreground p-3">
              No activities yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
