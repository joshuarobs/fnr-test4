import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

interface ModelSerialCellProps {
  modelSerialNumber: string;
}

export const ModelSerialCell: React.FC<ModelSerialCellProps> = ({
  modelSerialNumber,
}) => {
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

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipVisible}>
        <TooltipTrigger asChild>
          <div
            className="bg-gray-200 rounded p-2 font-mono cursor-pointer hover:bg-gray-300 transition-colors duration-200 flex items-center justify-between"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-sm text-gray-900">{modelSerialNumber}</span>
            {isCopied ? (
              <CheckIcon className="w-4 h-4 text-green-600 ml-3 stroke-4 scale-125 transform" />
            ) : (
              <CopyIcon className="w-4 h-4 text-gray-500 ml-3" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? 'Copied!' : 'Copy to clipboard'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
