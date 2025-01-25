import React from 'react';
import {
  Button,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@react-monorepo/shared';
import { LatestActivityEntry } from '../second-sidebar/LatestActivityEntry';
import { useGetClaimActivitiesQuery } from '../../store/services/api';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

interface PaginatedActivitiesContainerProps {
  className?: string;
  title?: string;
}

/**
 * PaginatedActivitiesContainer displays a paginated list of activities
 * Shows 10 activities at a time with pagination controls
 * Can be reused across multiple pages
 */
export const PaginatedActivitiesContainer = ({
  className = '',
  title = 'Latest activity',
}: PaginatedActivitiesContainerProps) => {
  const { id: claimId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize pagination state from URL parameters (convert from 1-based to 0-based)
  const [pagination, setPagination] = React.useState({
    pageIndex: Math.max(0, Number(searchParams.get('activityPage') || '1') - 1),
    pageSize: Number(searchParams.get('activityPageSize') || '10'),
  });

  // Update pagination when URL changes
  React.useEffect(() => {
    const pageFromUrl = Math.max(
      0,
      Number(searchParams.get('activityPage') || '1') - 1
    );
    const pageSizeFromUrl = Number(
      searchParams.get('activityPageSize') || '10'
    );

    setPagination({
      pageIndex: pageFromUrl,
      pageSize: pageSizeFromUrl,
    });
  }, [searchParams]);

  const { data, isLoading, error } = useGetClaimActivitiesQuery(
    {
      claimNumber: claimId || '',
      page: pagination.pageIndex + 1, // Convert to 1-based for API
      pageSize: pagination.pageSize,
    },
    { skip: !claimId }
  );

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('activityPage', (newPage + 1).toString());
    newParams.set('activityPageSize', pagination.pageSize.toString());
    setSearchParams(newParams, { replace: true });

    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize, 10);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('activityPage', '1');
    newParams.set('activityPageSize', size.toString());
    setSearchParams(newParams, { replace: true });

    setPagination({
      pageIndex: 0,
      pageSize: size,
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1">
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

      {/* Pagination Controls */}
      {data && data.activities.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-4">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of {data.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(0)}
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Go to first page</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(pagination.pageIndex + 1)}
                disabled={pagination.pageIndex === data.totalPages - 1}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(data.totalPages - 1)}
                disabled={pagination.pageIndex === data.totalPages - 1}
              >
                <span className="sr-only">Go to last page</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
