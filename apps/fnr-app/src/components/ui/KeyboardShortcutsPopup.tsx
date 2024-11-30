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
import {
  GENERAL_KEYBOARD_SHORTCUTS,
  CLAIM_PAGE_KEYBOARD_SHORTCUTS,
} from '../../constants/keyboard-shortcuts';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_CELL_STYLE}>
                General shortcuts
              </TableHead>
              <TableHead className={`${TABLE_CELL_STYLE} w-[200px]`}>
                Shortcut
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {GENERAL_KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <TableRow key={index}>
                <TableCell className={TABLE_CELL_STYLE}>
                  {shortcut.action}
                </TableCell>
                <TableCell
                  className={`${TABLE_CELL_STYLE} flex items-center gap-2 flex-wrap`}
                >
                  {shortcut.keybinds.map((keybind, keybindIndex) => (
                    <>
                      <span className="flex items-center gap-1">
                        {keybind.map((key, keyIndex) => (
                          <KeyboardKeyIcon key={keyIndex} letter={key} />
                        ))}
                      </span>
                      {keybindIndex < shortcut.keybinds.length - 1 && (
                        <span className="text-gray-500">or</span>
                      )}
                    </>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_CELL_STYLE}>Claims</TableHead>
              <TableHead className={`${TABLE_CELL_STYLE} w-[200px]`}>
                Shortcut
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CLAIM_PAGE_KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <TableRow key={index}>
                <TableCell className={TABLE_CELL_STYLE}>
                  {shortcut.action}
                </TableCell>
                <TableCell
                  className={`${TABLE_CELL_STYLE} flex items-center gap-2 flex-wrap`}
                >
                  {shortcut.keybinds.map((keybind, keybindIndex) => (
                    <>
                      <span className="flex items-center gap-1">
                        {keybind.map((key, keyIndex) => (
                          <KeyboardKeyIcon key={keyIndex} letter={key} />
                        ))}
                      </span>
                      {keybindIndex < shortcut.keybinds.length - 1 && (
                        <span className="text-gray-500">or</span>
                      )}
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
