import { KeyboardKeys } from './keyboard-constants';

// Type for a single keybind combination
export type KeybindCombination =
  (typeof KeyboardKeys)[keyof typeof KeyboardKeys][];

// Type for a shortcut with multiple possible keybind combinations
export interface KeyboardShortcut {
  action: string;
  keybinds: KeybindCombination[];
}

// Keyboard shortcut IDs
export const KeyboardShortcutId = {
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  VIEW_KEYBOARD_SHORTCUTS: 'VIEW_KEYBOARD_SHORTCUTS',
  EDIT_CELL: 'EDIT_CELL',
  FOCUS_FILTER_BAR: 'FOCUS_FILTER_BAR',
  NAVIGATE_PAGE_LEFT: 'NAVIGATE_PAGE_LEFT',
  NAVIGATE_PAGE_RIGHT: 'NAVIGATE_PAGE_RIGHT',
  OPEN_CLAIM_POPUP: 'OPEN_CLAIM_POPUP',
} as const;

// Application keyboard shortcuts map
export const GENERAL_KEYBOARD_SHORTCUTS_MAP: Record<string, KeyboardShortcut> =
  {
    [KeyboardShortcutId.TOGGLE_SIDEBAR]: {
      action: 'Toggle sidebar',
      keybinds: [[KeyboardKeys.LEFT_BRACKET], [KeyboardKeys.RIGHT_BRACKET]],
    },
    [KeyboardShortcutId.VIEW_KEYBOARD_SHORTCUTS]: {
      action: 'View this keyboard shortcuts popup',
      keybinds: [[KeyboardKeys.QUESTION_MARK]],
    },
    [KeyboardShortcutId.OPEN_CLAIM_POPUP]: {
      action: 'Open claim popup',
      keybinds: [[KeyboardKeys.C]],
    },
  };

// Claim page keyboard shortcuts map
export const CLAIM_PAGE_KEYBOARD_SHORTCUTS_MAP: Record<
  string,
  KeyboardShortcut
> = {
  [KeyboardShortcutId.EDIT_CELL]: {
    action: 'Edit cell',
    keybinds: [[KeyboardKeys.ENTER]],
  },
  [KeyboardShortcutId.FOCUS_FILTER_BAR]: {
    action: 'Focus filter bar',
    keybinds: [[KeyboardKeys.FORWARD_SLASH]],
  },
  [KeyboardShortcutId.NAVIGATE_PAGE_LEFT]: {
    action: 'Navigate page left',
    keybinds: [[KeyboardKeys.ALT, KeyboardKeys.ARROW_LEFT]],
  },
  [KeyboardShortcutId.NAVIGATE_PAGE_RIGHT]: {
    action: 'Navigate page right',
    keybinds: [[KeyboardKeys.ALT, KeyboardKeys.ARROW_RIGHT]],
  },
};

// For backwards compatibility and displaying all shortcuts in the keyboard shortcuts popup
export const GENERAL_KEYBOARD_SHORTCUTS = Object.values(
  GENERAL_KEYBOARD_SHORTCUTS_MAP
);
export const CLAIM_PAGE_KEYBOARD_SHORTCUTS = Object.values(
  CLAIM_PAGE_KEYBOARD_SHORTCUTS_MAP
);
