import React, { useState } from 'react';
import { Link, Globe } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Label,
  Separator,
  InputClearable,
} from '@react-monorepo/shared';

interface OurQuoteLinkIconProps {
  ourQuoteProof?: string;
  onSave?: (url: string) => void;
}

export const OurQuoteLinkIcon = ({
  ourQuoteProof,
  onSave,
}: OurQuoteLinkIconProps) => {
  // State for managing the website URL and its previous value
  const [websiteUrl, setWebsiteUrl] = useState<string>(ourQuoteProof || '');
  const [prevWebsiteUrl, setPrevWebsiteUrl] = useState<string>(
    ourQuoteProof || ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if current value differs from previous value
  const calculateChanges = () => {
    return websiteUrl !== prevWebsiteUrl;
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setHasChanges(calculateChanges());
    setIsOpen(open);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setWebsiteUrl(newUrl);
    setHasChanges(newUrl !== prevWebsiteUrl);
  };

  const handleClear = () => {
    setWebsiteUrl('');
    setHasChanges(true); // Set to true since we're clearing a value
  };

  const handleCancel = () => {
    setWebsiteUrl(prevWebsiteUrl);
    setHasChanges(false);
    setIsOpen(false);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(websiteUrl);
      setPrevWebsiteUrl(websiteUrl);
      setHasChanges(false);
      setIsOpen(false);
    }
  };

  // Button appearance based on server value and changes
  const buttonContent = () => (
    <Button
      variant="outline"
      className={`w-8 h-8 p-1 rounded-full ${
        prevWebsiteUrl
          ? 'bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
          : 'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
      } flex items-center justify-center ${
        hasChanges ? 'shadow-[0_0_10px_rgba(249,115,22,1.0)]' : ''
      }`}
      aria-label="View our quote"
    >
      <Link
        className={`w-4 h-4 ${
          prevWebsiteUrl ? 'text-white' : 'text-gray-500 dark:text-gray-400'
        }`}
      />
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent()}</TooltipTrigger>
            <TooltipContent>
              <p>View our quote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent className="w-96 overflow-hidden">
        <div className="grid gap-4 w-full">
          <div className="space-y-2 w-full">
            <h4 className="font-medium leading-none break-words">
              Our quote proof
            </h4>
            <p className="text-sm text-muted-foreground whitespace-normal break-words">
              Set a website link containing a quote that is fair and reasonable
              for the item.
            </p>
          </div>
          <div className="grid gap-2 w-full">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4 w-full">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Label htmlFor="website-url">Website</Label>
              </div>
              <InputClearable
                id="website-url"
                value={websiteUrl}
                onChange={handleUrlChange}
                onClear={handleClear}
                className="h-8 w-full max-w-full"
                placeholder="e.g. www.amazon.com"
                autoComplete="off"
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
            <Button
              size="sm"
              className="px-3"
              disabled={!hasChanges}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
