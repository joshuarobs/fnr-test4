import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@react-monorepo/shared';
import { PaginatedActivitiesContainer } from '../contents-other/PaginatedActivitiesContainer';
import { Button } from '@react-monorepo/shared';

/**
 * Dialog component that shows all activities for a claim in a paginated view
 * Triggered from the "View all" button in LatestActivitiesContainer
 */
export const AllActivitiesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>All Activities</DialogTitle>
        </DialogHeader>
        <div className="h-[calc(80vh-120px)]">
          <PaginatedActivitiesContainer title="" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
