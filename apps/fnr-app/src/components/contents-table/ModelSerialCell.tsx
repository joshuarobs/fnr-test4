import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import { BrowseLinkButton } from './BrowseLinkButton';
import truncate from 'cli-truncate';

interface ModelSerialCellProps {
  modelSerialNumber: string;
}

export const ModelSerialCell = ({
  modelSerialNumber,
}: ModelSerialCellProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(modelSerialNumber).then(() => {
      setIsCopied(true);
      setIsTooltipVisible(true);
    });
  }, [modelSerialNumber]);

  const handleMouseEnter = useCallback(() => {
    if (!isTooltipVisible) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsTooltipVisible(true);
      }, 500);
    }
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
  }, [isTooltipVisible]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (isCopied) {
      copyTimeoutRef.current = setTimeout(() => {
        setIsTooltipVisible(false);
        setTimeout(() => setIsCopied(false), 100); // Short delay to ensure tooltip is hidden before changing content
      }, 2000);
    } else {
      setIsTooltipVisible(false);
    }
  }, [isCopied]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Function to truncate model serial number if needed
  const getDisplayedModelSerial = (serial: string) => {
    const MIN_START_CHARS = 5; // minimum characters to show at start
    const MIN_END_CHARS = 3; // minimum characters to show at end
    const ELLIPSIS = '...';
    const MIN_TOTAL_LENGTH = MIN_START_CHARS + MIN_END_CHARS + ELLIPSIS.length;

    // If the serial is shorter than or equal to the minimum total length,
    // show the entire serial without truncation
    if (serial.length <= MIN_TOTAL_LENGTH) {
      return serial;
    }

    // Otherwise, truncate with ellipsis in the middle
    return `${serial.slice(0, MIN_START_CHARS)}${ELLIPSIS}${serial.slice(
      -MIN_END_CHARS
    )}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 min-w-0">
        <TooltipProvider>
          <Tooltip open={isTooltipVisible}>
            <TooltipTrigger asChild>
              <div
                className="bg-gray-200 rounded p-2 font-mono cursor-pointer hover:bg-gray-300 transition-colors duration-200 flex items-center gap-3 select-none whitespace-nowrap overflow-hidden"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-sm text-gray-900 truncate">
                  {getDisplayedModelSerial(modelSerialNumber)}
                </span>
                {isCopied ? (
                  <CheckIcon className="w-4 h-4 text-green-600 stroke-4 scale-125 transform flex-shrink-0" />
                ) : (
                  <CopyIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCopied ? 'Copied!' : 'Copy to clipboard'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex-shrink-0">
        <BrowseLinkButton
          tooltipText="Search for item in Google in a new tab"
          searchText={modelSerialNumber}
        />
      </div>
    </div>
  );
};
