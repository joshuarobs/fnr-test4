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
  const [copied, setCopied] = useState(false);
  const [copiedTooltip, setCopiedTooltip] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const justResetRef = useRef(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(modelSerialNumber).then(() => {
      setShowTooltip(true);
      setCopied(true);
      setCopiedTooltip(true);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
        // setCopiedTooltip(false);
        setCopied(false);
        justResetRef.current = true;
      }, 2000);
    });
  }, [modelSerialNumber]);

  const handleMouseEnter = useCallback(() => {
    if (!copied && !justResetRef.current) {
      setCopied(false);
      setCopiedTooltip(false);
      hoverTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, 500); // Delay before showing tooltip
    }
    justResetRef.current = false;
  }, [copied]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (!copiedTooltip) {
      setShowTooltip(false);
    }
  }, [copiedTooltip]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <div
            className="bg-gray-200 rounded p-2 font-mono cursor-pointer hover:bg-gray-300 transition-colors duration-200 flex items-center justify-between"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-sm text-gray-900">{modelSerialNumber}</span>
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-600 ml-3 stroke-4 scale-125 transform" />
            ) : (
              <CopyIcon className="w-4 h-4 text-gray-500 ml-3" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copiedTooltip ? 'Copied!' : 'Copy to clipboard'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
