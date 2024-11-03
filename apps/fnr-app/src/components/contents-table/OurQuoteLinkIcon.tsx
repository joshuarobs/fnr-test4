import React, { useState } from 'react';
import { Link, Image, Globe } from 'lucide-react';
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

interface OurQuoteLinkIconProps {
  quoteLink?: string;
}

export const OurQuoteLinkIcon = ({ quoteLink }: OurQuoteLinkIconProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prevSelectedFile, setPrevSelectedFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [prevWebsiteUrl, setPrevWebsiteUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const calculateChanges = () => {
    const fileChanged =
      selectedFile !== null && selectedFile !== prevSelectedFile;
    const urlChanged = websiteUrl !== prevWebsiteUrl && websiteUrl !== '';
    return fileChanged || urlChanged;
  };

  const handlePopoverOpenChange = (open: boolean) => {
    if (!open) {
      if (websiteUrl === '' && !selectedFile) {
        setHasChanges(false);
        setPrevWebsiteUrl('');
        setPrevSelectedFile(null);
      } else {
        setHasChanges(calculateChanges());
      }
    }
    setIsOpen(open);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setPrevSelectedFile(selectedFile);
      setSelectedFile(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrevWebsiteUrl(websiteUrl);
    setWebsiteUrl(e.target.value);
  };

  const handleCancel = () => {
    if (websiteUrl === '' && !selectedFile) {
      setHasChanges(false);
      setPrevWebsiteUrl('');
      setPrevSelectedFile(null);
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
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Label htmlFor="website-url">Website</Label>
              </div>
              <Input
                id="website-url"
                value={websiteUrl}
                onChange={handleUrlChange}
                className="col-span-2 h-8"
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
            <Button size="sm" className="px-3">
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
