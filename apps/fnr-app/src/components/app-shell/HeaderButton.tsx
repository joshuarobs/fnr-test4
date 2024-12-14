import React from 'react';
import { Button, type ButtonProps } from '@react-monorepo/shared';

// Common header button styling that can be used across different header buttons
export const HeaderButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={`bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 ${
          className || ''
        }`}
        {...props}
      />
    );
  }
);

HeaderButton.displayName = 'HeaderButton';

// Specific variant for icon-only header buttons
export const HeaderIconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <HeaderButton ref={ref} size="icon" className={className} {...props} />
  );
});

HeaderIconButton.displayName = 'HeaderIconButton';
