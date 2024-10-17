import { ExternalLinkIcon } from '@radix-ui/react-icons';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipSettings,
} from '@react-monorepo/shared';

export const BrowseLinkButton = () => {
  return (
    <TooltipProvider delayDuration={TooltipSettings.DelayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Search item in new tab"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Search model/serial number in Google</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
