import { Button } from '@react-monorepo/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@react-monorepo/shared';

interface AddNewItemModalProps {
  onConfirm: () => void;
}

export const AddNewItemModal = ({ onConfirm }: AddNewItemModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-2">Add Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onConfirm}>Confirm Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
