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

// Common table cell padding style
const TABLE_CELL_STYLE = 'p-2';

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
    { action: 'Toggle sidebar', keys: [KeyboardKeys.LEFT_BRACKET] },
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
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_CELL_STYLE}>Action</TableHead>
              <TableHead className={TABLE_CELL_STYLE}>Shortcut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortcuts.map((shortcut, index) => (
              <TableRow key={index}>
                <TableCell className={TABLE_CELL_STYLE}>
                  {shortcut.action}
                </TableCell>
                <TableCell
                  className={`${TABLE_CELL_STYLE} flex items-center gap-1`}
                >
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
