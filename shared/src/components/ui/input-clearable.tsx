import * as React from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { cn } from '../../lib/utils';
import { Input } from './input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

export interface InputClearableProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const InputClearable = React.forwardRef<HTMLInputElement, InputClearableProps>(
  ({ className, onClear, value, onChange, ...props }, ref) => {
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
          ref={ref}
          {...props}
        />
        {value && (
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
        )}
      </div>
    );
  }
);
InputClearable.displayName = 'InputClearable';

export { InputClearable };
