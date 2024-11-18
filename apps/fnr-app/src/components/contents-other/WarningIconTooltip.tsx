import { IoWarning } from 'react-icons/io5';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

interface WarningIconTooltipProps {
  warningString: string;
}

// Component that displays a warning icon with a tooltip containing the warning message
export const WarningIconTooltip = ({
  warningString,
}: WarningIconTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <IoWarning className="h-4 w-4 text-orange-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{warningString}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
