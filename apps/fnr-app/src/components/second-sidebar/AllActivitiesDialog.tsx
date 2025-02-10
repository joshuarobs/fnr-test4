import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@react-monorepo/shared';
import { PaginatedActivitiesContainer } from '../contents-other/PaginatedActivitiesContainer';
import { Button } from '@react-monorepo/shared';

interface AllActivitiesDialogProps {
  totalActivitiesNumber?: number;
}

/**
 * Dialog component that shows all activities for a claim in a paginated view
 * Triggered from the "View all" button in LatestActivitiesContainer
 */
export const AllActivitiesDialog = ({
  totalActivitiesNumber = 0,
}: AllActivitiesDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="select-none">
          View all
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            All Activities
            <Badge variant="secondary">{totalActivitiesNumber}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="h-[calc(80vh-120px)]">
          <PaginatedActivitiesContainer title="" wideVersion />
        </div>
      </DialogContent>
    </Dialog>
  );
};
