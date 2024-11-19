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
  keyboardKey?: string;
}

const InputClearable = React.forwardRef<HTMLInputElement, InputClearableProps>(
  ({ className, onClear, value, onChange, keyboardKey, ...props }, ref) => {
    // Create internal ref if no ref provided
    const inputRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;

    React.useEffect(() => {
      if (keyboardKey) {
        // Create a new handler instance for this component
        const handler = keys();

        // Add the binding
        handler.add(keyboardKey, () => {
          // Focus the input
          if (resolvedRef.current) {
            resolvedRef.current.focus();
          }
        });

        // Attach the handler to the window
        const handleKeyDown = (e: KeyboardEvent) => {
          // Prevent the key from being typed into the input
          if (e.key === keyboardKey) {
            e.preventDefault();
          }
          handler.handle(e);
        };
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }
    }, [keyboardKey, resolvedRef]);

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
        ) : keyboardKey ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <KeyboardKeyIcon letter={keyboardKey} />
          </div>
        ) : null}
      </div>
    );
  }
);
InputClearable.displayName = 'InputClearable';

export { InputClearable };
