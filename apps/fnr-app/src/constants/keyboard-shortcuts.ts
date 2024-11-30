import { KeyboardKeys } from './keyboard-constants';

// Type for a single keybind combination
export type KeybindCombination =
  (typeof KeyboardKeys)[keyof typeof KeyboardKeys][];

// Type for a shortcut with multiple possible keybind combinations
export interface KeyboardShortcut {
  action: string;
  keybinds: KeybindCombination[];
}

// Application keyboard shortcuts
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    action: 'Toggle sidebar',
    keybinds: [[KeyboardKeys.LEFT_BRACKET], [KeyboardKeys.RIGHT_BRACKET]],
  },
  {
    action: 'View this keyboard shortcuts popup',
    keybinds: [[KeyboardKeys.QUESTION_MARK]],
  },
  {
    action: 'Edit cell',
    keybinds: [[KeyboardKeys.ENTER]],
  },
  {
    action: 'Focus filter bar',
    keybinds: [[KeyboardKeys.FORWARD_SLASH]],
  },
  {
    action: 'Navigate page left',
    keybinds: [[KeyboardKeys.ALT, KeyboardKeys.ARROW_LEFT]],
  },
  {
    action: 'Navigate page right',
    keybinds: [[KeyboardKeys.ALT, KeyboardKeys.ARROW_RIGHT]],
  },
];
