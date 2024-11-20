import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  KeyboardKeyIcon,
} from '@react-monorepo/shared';
import { KeyboardKeys } from '../../constants/keyboard-constants';

interface KeyboardShortcutsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Component to display keyboard shortcuts in a dialog popup
const KeyboardShortcutsPopup = ({
  isOpen,
  onClose,
}: KeyboardShortcutsPopupProps) => {
  // Example keyboard shortcuts - can be expanded as needed
  const shortcuts = [
    { action: 'Edit cell', keys: [KeyboardKeys.ENTER] },
    { action: 'Focus filter bar', keys: [KeyboardKeys.FORWARD_SLASH] },
    {
      action: 'View this keyboard shortcuts popup',
      keys: [KeyboardKeys.QUESTION_MARK],
    },
    { action: 'Save changes', keys: [KeyboardKeys.CTRL, KeyboardKeys.S] },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow className="p-2">
              <TableHead>Action</TableHead>
              <TableHead>Shortcut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortcuts.map((shortcut, index) => (
              <TableRow key={index} className="">
                <TableCell className="py-2">{shortcut.action}</TableCell>
                <TableCell className="flex items-center gap-1 py-2">
                  {shortcut.keys.map((key, keyIndex) => (
                    <>
                      <KeyboardKeyIcon key={keyIndex} letter={key} />
                      <span className="" />
                    </>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsPopup;
