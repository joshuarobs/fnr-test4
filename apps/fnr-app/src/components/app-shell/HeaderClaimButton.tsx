import React, { useState, useRef, useEffect } from 'react';
import { CaretDownIcon } from '@radix-ui/react-icons';
import keys from 'ctrl-keys';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Separator,
  InputClearable,
  Button,
} from '@react-monorepo/shared';
import { HeaderButton } from './HeaderButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { getClaimRoute } from '../../routes';
import { useIsAdminRoute } from '../../hooks/useIsAdminRoute';

// Props to control positioning from Header component
interface HeaderClaimButtonProps {
  style?: React.CSSProperties;
}

export const HeaderClaimButton = ({ style }: HeaderClaimButtonProps) => {
  const [claimNumber, setClaimNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = useIsAdminRoute();

  // Extract claim ID from URL if we're on a claim page
  const currentClaimId = location.pathname.match(/^\/claim\/([^/]+)/)?.[1];

  const focusInput = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    // Create a new handler instance for this component
    const handler = keys();

    // Add the binding for 'c' key
    handler.add('c', () => {
      // Only open if no input elements are focused
      if (
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setIsOpen(true);
        focusInput();
      }
    });

    // Attach the handler to the window
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only prevent default if no input is focused
      if (
        e.key.toLowerCase() === 'c' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
      }
      handler.handle(e);
    };
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      focusInput();
    }
  };

  const handleViewClaim = () => {
    if (claimNumber) {
      // Convert claim number to uppercase before navigation
      const formattedClaimNumber = claimNumber.toUpperCase();
      navigate(getClaimRoute(formattedClaimNumber));
      setClaimNumber(''); // Reset input after navigation
      setIsOpen(false); // Close dropdown after navigation
    }
  };

  // Don't render the button in admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <HeaderButton
          asChild={false}
          className="flex items-center gap-2 px-3"
          style={style}
        >
          <div className="whitespace-nowrap">
            <span className="underline">C</span>laim
            {currentClaimId ? ` (${currentClaimId})` : ''}
          </div>
          <Separator orientation="vertical" className="h-4" />
          <CaretDownIcon className="h-4 w-4" />
        </HeaderButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[200px] shadow-[0_10px_38px_-10px_rgba(22,23,24,0.45),0_10px_20px_-15px_rgba(22,23,24,0.4)]"
      >
        {/* Claim number input at the top */}
        <div className="p-2 flex flex-col gap-2">
          <InputClearable
            ref={inputRef}
            placeholder="Enter claim number"
            value={claimNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setClaimNumber(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleViewClaim();
              }
            }}
          />
          <Button
            variant="default"
            className="w-full"
            disabled={!claimNumber}
            onClick={handleViewClaim}
          >
            View claim
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
