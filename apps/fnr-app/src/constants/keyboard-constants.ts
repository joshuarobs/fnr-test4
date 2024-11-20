/**
 * Constants for keyboard key display values
 * Used to maintain consistency in how keyboard shortcuts are displayed across the application
 */
export const KeyboardKeys = {
  // Navigation keys
  ARROW_UP: '↑',
  ARROW_DOWN: '↓',
  ARROW_LEFT: '←',
  ARROW_RIGHT: '→',
  PAGE_UP: 'Page Up',
  PAGE_DOWN: 'Page Down',
  HOME: 'Home',
  END: 'End',

  // Special keys
  ENTER: 'Enter',
  SPACE: 'Space',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  ESCAPE: 'Esc',
  CAPS_LOCK: 'Caps Lock',

  // Modifier keys
  CTRL: 'Ctrl',
  ALT: 'Alt',
  SHIFT: 'Shift',
  META: 'Meta',
  COMMAND: '⌘',

  // Function keys
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',

  // Numbers
  NUM_0: '0',
  NUM_1: '1',
  NUM_2: '2',
  NUM_3: '3',
  NUM_4: '4',
  NUM_5: '5',
  NUM_6: '6',
  NUM_7: '7',
  NUM_8: '8',
  NUM_9: '9',

  // Letters
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'J',
  K: 'K',
  L: 'L',
  M: 'M',
  N: 'N',
  O: 'O',
  P: 'P',
  Q: 'Q',
  R: 'R',
  S: 'S',
  T: 'T',
  U: 'U',
  V: 'V',
  W: 'W',
  X: 'X',
  Y: 'Y',
  Z: 'Z',

  // Symbols and punctuation
  FORWARD_SLASH: '/',
  BACK_SLASH: '\\',
  QUESTION_MARK: '?',
  PERIOD: '.',
  COMMA: ',',
  SEMICOLON: ';',
  COLON: ':',
  QUOTE: "'",
  DOUBLE_QUOTE: '"',
  BACKTICK: '`',
  TILDE: '~',
  EXCLAMATION: '!',
  AT: '@',
  HASH: '#',
  DOLLAR: '$',
  PERCENT: '%',
  CARET: '^',
  AMPERSAND: '&',
  ASTERISK: '*',
  LEFT_PAREN: '(',
  RIGHT_PAREN: ')',
  MINUS: '-',
  PLUS: '+',
  EQUALS: '=',
  LEFT_BRACKET: '[',
  RIGHT_BRACKET: ']',
  LEFT_BRACE: '{',
  RIGHT_BRACE: '}',
  PIPE: '|',

  // Numpad
  NUMPAD_0: 'Num 0',
  NUMPAD_1: 'Num 1',
  NUMPAD_2: 'Num 2',
  NUMPAD_3: 'Num 3',
  NUMPAD_4: 'Num 4',
  NUMPAD_5: 'Num 5',
  NUMPAD_6: 'Num 6',
  NUMPAD_7: 'Num 7',
  NUMPAD_8: 'Num 8',
  NUMPAD_9: 'Num 9',
  NUMPAD_MULTIPLY: 'Num *',
  NUMPAD_ADD: 'Num +',
  NUMPAD_SUBTRACT: 'Num -',
  NUMPAD_DECIMAL: 'Num .',
  NUMPAD_DIVIDE: 'Num /',
  NUMPAD_ENTER: 'Num Enter',

  // Media keys
  VOLUME_UP: 'Volume Up',
  VOLUME_DOWN: 'Volume Down',
  VOLUME_MUTE: 'Volume Mute',
  MEDIA_PLAY_PAUSE: 'Play/Pause',
  MEDIA_STOP: 'Media Stop',
  MEDIA_NEXT: 'Media Next',
  MEDIA_PREV: 'Media Prev',

  // Browser keys
  BROWSER_BACK: 'Browser Back',
  BROWSER_FORWARD: 'Browser Forward',
  BROWSER_REFRESH: 'Browser Refresh',
  BROWSER_SEARCH: 'Browser Search',
  BROWSER_FAVORITES: 'Browser Favorites',
  BROWSER_HOME: 'Browser Home',
} as const;

// Type for the keyboard keys object
export type KeyboardKey = keyof typeof KeyboardKeys;

// Type guard to check if a string is a valid keyboard key
export const isKeyboardKey = (key: string): key is KeyboardKey => {
  return key in KeyboardKeys;
};
