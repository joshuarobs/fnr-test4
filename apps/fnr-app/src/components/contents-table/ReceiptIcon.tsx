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
  InputClearable,
  Label,
  Separator,
} from '@react-monorepo/shared';
interface ReceiptIconProps {
  receiptLink: string | null;
}

export const ReceiptIcon = ({ receiptLink }: ReceiptIconProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prevSelectedFile, setPrevSelectedFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [prevWebsiteUrl, setPrevWebsiteUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const calculateChanges = () => {
    const fileChanged =
      selectedFile !== null && selectedFile !== prevSelectedFile;
    const urlChanged = websiteUrl !== prevWebsiteUrl;
    return fileChanged || urlChanged;
  };

  const handlePopoverOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      return;
    }
    // When opening, set the previous states to the current values
    setPrevWebsiteUrl(websiteUrl);
    setPrevSelectedFile(selectedFile);
    setHasChanges(false);
    setIsOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setHasChanges(calculateChanges());
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setWebsiteUrl(newUrl);
    // We need to calculate changes after state updates, so we use the new values directly
    const fileChanged =
      selectedFile !== null && selectedFile !== prevSelectedFile;
    const urlChanged = newUrl !== prevWebsiteUrl;
    setHasChanges(fileChanged || urlChanged);
  };

  const handleCancel = () => {
    setSelectedFile(prevSelectedFile);
    setWebsiteUrl(prevWebsiteUrl);
    setHasChanges(false);
    setIsOpen(false);
  };

  const buttonContent = () => (
    <Button
      variant="outline"
      className={`w-8 h-8 p-1 rounded-full flex items-center justify-center cursor-pointer ${
        receiptLink || selectedFile || websiteUrl
          ? 'bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
          : 'bg-white hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700'
      } ${hasChanges ? 'shadow-[0_0_10px_rgba(249,115,22,1.0)]' : ''}`}
      aria-label={
        receiptLink || selectedFile || websiteUrl
          ? 'View receipt'
          : 'Add receipt'
      }
    >
      {receiptLink || selectedFile || websiteUrl ? (
        <Receipt className="w-4 h-4 text-white" />
      ) : (
        <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      )}
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent()}</TooltipTrigger>
            <TooltipContent>
              <p>
                {receiptLink || selectedFile || websiteUrl
                  ? 'View receipt'
                  : 'Add receipt'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent className="w-96 overflow-hidden">
        <div className="grid gap-4 w-full">
          <div className="space-y-2 w-full">
            <h4 className="font-medium leading-none break-words">
              Insured's quote proof
            </h4>
            <p className="text-sm text-muted-foreground whitespace-normal break-words">
              Set an invoice, receipt or quote photo. Or set a website link for
              the quote.
            </p>
          </div>
          <div className="grid gap-2 w-full">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4 w-full">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <Label htmlFor="receipt-file">Photo</Label>
              </div>
              <Input
                id="receipt-file"
                className="h-8 cursor-pointer w-full max-w-full"
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
            <div className="grid grid-cols-[auto_1fr] items-center gap-4 w-full">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Label htmlFor="website-url">Website</Label>
              </div>
              <InputClearable
                id="website-url"
                value={websiteUrl}
                onChange={handleUrlChange}
                className="h-8 w-full max-w-full"
                placeholder="e.g. www.amazon.com"
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button size="sm" className="px-3" disabled={!hasChanges}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
