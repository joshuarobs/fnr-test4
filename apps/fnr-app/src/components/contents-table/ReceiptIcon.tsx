import React, { useState } from 'react';
import { Receipt, Plus, Image, Globe } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Label,
  Separator,
} from '@react-monorepo/shared';

interface ReceiptIconProps {
  receiptLink?: string;
}

export const ReceiptIcon = ({ receiptLink }: ReceiptIconProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const buttonContent = () => (
    <Button
      variant="outline"
      className={`w-8 h-8 p-1 rounded-full flex items-center justify-center cursor-pointer ${
        receiptLink || selectedFile
          ? 'bg-blue-400 hover:bg-blue-500'
          : 'bg-white hover:bg-white'
      }`}
      aria-label={receiptLink || selectedFile ? 'View receipt' : 'Add receipt'}
    >
      {receiptLink || selectedFile ? (
        <Receipt className="w-4 h-4 text-white" />
      ) : (
        <Plus className="w-5 h-5 text-gray-500" />
      )}
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent()}</TooltipTrigger>
            <TooltipContent>
              <p>
                {receiptLink || selectedFile ? 'View receipt' : 'Add receipt'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Insured's quote proof</h4>
            <p className="text-sm text-muted-foreground">
              Set an invoice, receipt or quote photo. Or set a website link for
              the quote.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <Label htmlFor="receipt-file">Photo</Label>
              </div>
              <Input
                id="receipt-file"
                className="col-span-2 h-8 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
            <div className="flex items-center gap-3 w-full">
              <Separator className="flex-1" />
              <p className="text-sm text-muted-foreground px-2 select-none">
                Or
              </p>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Label htmlFor="maxWidth">Website</Label>
              </div>
              <Input id="maxWidth" defaultValue="" className="col-span-2 h-8" />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" className="px-3">
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
