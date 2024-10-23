import React from 'react';
import { Receipt, Plus } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@react-monorepo/shared';

interface ReceiptIconProps {
  receiptLink?: string;
}

export const ReceiptIcon = ({ receiptLink }: ReceiptIconProps) => {
  const buttonContent = () => (
    <Button
      variant="outline"
      className={`w-8 h-8 p-1 rounded-full flex items-center justify-center cursor-pointer ${
        receiptLink
          ? 'bg-blue-400 hover:bg-blue-500'
          : 'bg-white hover:bg-white'
      }`}
      aria-label={receiptLink ? 'View receipt' : 'Add receipt'}
    >
      {receiptLink ? (
        <Receipt className="w-4 h-4 text-white" />
      ) : (
        <Plus className="w-5 h-5 text-gray-500" />
      )}
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent()}</TooltipTrigger>
            <TooltipContent>
              <p>{receiptLink ? 'View receipt' : 'Add receipt'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
};
