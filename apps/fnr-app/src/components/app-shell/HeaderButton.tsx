import React from 'react';
import { Button, type ButtonProps } from '@react-monorepo/shared';

// Common header button styling that can be used across different header buttons
export const HeaderButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={`bg-header-background hover:bg-header-hover border border-header-border text-header-icon select-none ${
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
    <HeaderButton
      ref={ref}
      size="icon"
      className={`select-none ${className || ''}`}
      {...props}
    />
  );
});

HeaderIconButton.displayName = 'HeaderIconButton';
