import React, { useState, useRef } from 'react';
import { CaretDownIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Separator,
  InputClearable,
  Button,
} from '@react-monorepo/shared';
import { HeaderButton } from './HeaderButton';
import { DropdownMenuListItem } from '../ui/DropdownMenuListItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { getClaimRoute } from '../../routes';

// Props to control positioning from Header component
interface HeaderClaimButtonProps {
  style?: React.CSSProperties;
}

export const HeaderClaimButton = ({ style }: HeaderClaimButtonProps) => {
  const [claimNumber, setClaimNumber] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract claim ID from URL if we're on a claim page
  const currentClaimId = location.pathname.match(/^\/claim\/([^/]+)/)?.[1];

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleViewClaim = () => {
    if (claimNumber) {
      // Convert claim number to uppercase before navigation
      const formattedClaimNumber = claimNumber.toUpperCase();
      navigate(getClaimRoute(formattedClaimNumber));
      setClaimNumber(''); // Reset input after navigation
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <HeaderButton
          asChild={false}
          className="flex items-center gap-2 px-3"
          style={style}
        >
          {currentClaimId ? `Claim (${currentClaimId})` : 'Claim'}
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
