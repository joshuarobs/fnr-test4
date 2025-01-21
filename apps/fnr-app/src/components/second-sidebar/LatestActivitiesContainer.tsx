import { Button, ScrollArea } from '@react-monorepo/shared';
import { LatestActivityEntry } from './LatestActivityEntry';
import { useGetClaimActivitiesQuery } from '../../store/services/api';
import { useParams } from 'react-router-dom';

export const LatestActivitiesContainer = () => {
  const { id: claimId } = useParams();

  const { data, isLoading, error } = useGetClaimActivitiesQuery(
    { claimNumber: claimId || '', limit: 6 },
    { skip: !claimId }
  );

  console.log('LatestActivitiesContainer state:', {
    claimId,
    data,
    isLoading,
    error,
    hasData: !!data,
    dataLength: data?.length,
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Latest activity</h2>
        <Button variant="outline" size="sm">
          View all
        </Button>
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
          {data?.map((activity) => (
            <LatestActivityEntry key={activity.id} activity={activity} />
          ))}

          {/* Show empty state */}
          {data?.length === 0 && (
            <p className="text-sm text-muted-foreground p-3">
              No activities yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
