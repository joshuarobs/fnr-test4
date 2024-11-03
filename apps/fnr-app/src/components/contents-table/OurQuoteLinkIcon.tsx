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
  quoteLink?: string;
}

export const OurQuoteLinkIcon = ({ quoteLink }: OurQuoteLinkIconProps) => {
  const [websiteUrl, setWebsiteUrl] = useState<string>(quoteLink || '');
  const [prevWebsiteUrl, setPrevWebsiteUrl] = useState<string>(quoteLink || '');
  const [isOpen, setIsOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const calculateChanges = () => {
    return websiteUrl !== prevWebsiteUrl && websiteUrl !== '';
  };

  const handlePopoverOpenChange = (open: boolean) => {
    if (websiteUrl === '') {
      setHasChanges(false);
      setPrevWebsiteUrl('');
    } else {
      setHasChanges(calculateChanges());
    }
    setIsOpen(open);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setWebsiteUrl(newUrl);
    setHasChanges(newUrl !== prevWebsiteUrl && newUrl !== '');
  };

  const handleClear = () => {
    setWebsiteUrl('');
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (websiteUrl === '') {
      setHasChanges(false);
      setPrevWebsiteUrl('');
    } else {
      setHasChanges(calculateChanges());
    }
    setIsOpen(false);
  };

  const buttonContent = () => (
    <Button
      variant="outline"
      className={`w-8 h-8 p-1 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center ${
        hasChanges ? 'shadow-[0_0_10px_rgba(249,115,22,1.0)]' : ''
      }`}
      aria-label="View our quote"
    >
      <Link className="w-4 h-4 text-white" />
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
      <PopoverContent className="w-96">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Our quote proof</h4>
            <p className="text-sm text-muted-foreground">
              Set a website link containing a quote that is fair and reasonable
              for the item.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Label htmlFor="website-url">Website</Label>
              </div>
              <InputClearable
                id="website-url"
                value={websiteUrl}
                onChange={handleUrlChange}
                onClear={handleClear}
                className="h-8 w-full"
                placeholder="e.g. www.amazon.com"
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2">
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
