import React from 'react';
import { Receipt } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

export const ReceiptIcon = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-full bg-blue-400 hover:bg-blue-500"
            aria-label="View receipt"
          >
            <Receipt className="w-5 h-5 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View receipt</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
