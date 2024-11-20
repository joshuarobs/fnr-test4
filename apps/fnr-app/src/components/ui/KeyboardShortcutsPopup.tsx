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
    { action: 'Show Shortcuts', keys: ['?'] },
    { action: 'Navigate cells', keys: ['↑', '↓', '←', '→'] },
    { action: 'Edit cell', keys: ['Enter'] },
    { action: 'Focus filter bar', keys: ['/'] },
    { action: 'View this keyboard shortcuts popup', keys: ['?'] },
    { action: 'Save changes', keys: ['Ctrl', 'S'] },
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
                      {keyIndex < shortcut.keys.length - 1 && <span>+</span>}
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
