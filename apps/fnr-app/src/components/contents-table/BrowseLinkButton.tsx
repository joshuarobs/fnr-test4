import { ExternalLinkIcon } from '@radix-ui/react-icons';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

interface BrowseLinkButtonProps {
  tooltipText: string;
  searchText: string;
}

export const BrowseLinkButton = ({
  tooltipText = '',
  searchText,
}: BrowseLinkButtonProps) => {
  const handleClick = () => {
    const encodedSearchText = encodeURIComponent(searchText);
    window.open(
      `https://www.google.com/search?q=${encodedSearchText}`,
      '_blank'
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Search item in new tab"
            onClick={handleClick}
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
