import * as React from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import keys from 'ctrl-keys';
import { cn } from '../../lib/utils';
import { Input } from './input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { KeyboardKeyIcon } from './keyboard-key-icon';

export interface InputClearableProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  focusKeyboardKey?: string;
  escapeKeyClears?: boolean; // Controls if escape key can clear input
  canPressFocusKeybind?: boolean; // Controls if focus keyboard shortcut should be processed
}

const InputClearable = React.forwardRef<HTMLInputElement, InputClearableProps>(
  (
    {
      className,
      onClear,
      value,
      onChange,
      focusKeyboardKey,
      escapeKeyClears = false,
      canPressFocusKeybind = true, // Default to true to maintain backward compatibility
      ...props
    },
    ref
  ) => {
    // Create internal ref if no ref provided
    const inputRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;

    React.useEffect(() => {
      // Handle escape key press when input is focused
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (
          e.key === 'Escape' &&
          document.activeElement === resolvedRef.current
        ) {
          if (value && escapeKeyClears) {
            // If there's a value and escapeKeyClears is true, clear it
            handleClear();
          } else {
            // If there's no value or escapeKeyClears is false, blur the input
            resolvedRef.current?.blur();
          }
        }
      };
      window.addEventListener('keydown', handleEscapeKey);

      if (focusKeyboardKey && canPressFocusKeybind) {
        // Create a new handler instance for this component
        const handler = keys();

        // Add the binding
        handler.add(focusKeyboardKey, () => {
          // Focus the input
          if (resolvedRef.current) {
            resolvedRef.current.focus();
          }
        });

        // Attach the handler to the window
        const handleKeyDown = (e: KeyboardEvent) => {
          // Only prevent the key from being typed if the input is not focused
          if (
            e.key === focusKeyboardKey &&
            document.activeElement !== resolvedRef.current
          ) {
            e.preventDefault();
          }
          handler.handle(e);
        };
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keydown', handleEscapeKey);
        };
      }

      // If no focusKeyboardKey or canPressFocusKeybind is false, still need to cleanup escape handler
      return () => {
        window.removeEventListener('keydown', handleEscapeKey);
      };
    }, [
      focusKeyboardKey,
      resolvedRef,
      value,
      escapeKeyClears,
      canPressFocusKeybind,
    ]);

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      onClear?.();
    };

    return (
      <div className="relative w-full">
        <Input
          value={value}
          onChange={onChange}
          className={cn('pr-8 w-full', className)}
          ref={resolvedRef}
          {...props}
        />
        {value ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                >
                  <IoCloseCircle className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={0}>
                <p>Clear</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : focusKeyboardKey ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <KeyboardKeyIcon letter={focusKeyboardKey} />
          </div>
        ) : null}
      </div>
    );
  }
);
InputClearable.displayName = 'InputClearable';

export { InputClearable };
