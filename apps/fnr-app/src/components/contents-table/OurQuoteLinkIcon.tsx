import React from 'react';
import { Link } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

export const OurQuoteLinkIcon = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 p-1 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center"
            aria-label="View our quote"
          >
            <Link className="w-4 h-4 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View our quote</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
