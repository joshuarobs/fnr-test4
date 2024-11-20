import keys from 'ctrl-keys';
import { store } from '../store/store';
import {
  addActiveBinding,
  removeActiveBinding,
} from '../store/features/keyboardSlice';

// Create a singleton handler instance
const handler = keys();

// Helper to track binding in Redux
const trackBinding = (binding: string, isActive: boolean) => {
  if (isActive) {
    store.dispatch(addActiveBinding(binding));
  } else {
    store.dispatch(removeActiveBinding(binding));
  }
};

/**
 * Initialize keyboard bindings for the application
 * Add new bindings here as needed
 */
export const initializeKeyboardBindings = () => {
  // Add other keyboard shortcuts here
  handler.add('ctrl+/', () => {
    // Toggle search/command palette
    trackBinding('ctrl+/', true);
    console.log('Search/Command palette toggled');
    return () => trackBinding('ctrl+/', false);
  });

  return handler;
};

/**
 * Get the keyboard event handler
 * This should be attached to the window or specific DOM elements
 */
export const getKeyboardHandler = () => {
  return handler.handle;
};

/**
 * Enable/disable all keyboard shortcuts
 */
export const setKeyboardEnabled = (enabled: boolean) => {
  if (enabled) {
    handler.enable();
  } else {
    handler.disable();
  }
};
