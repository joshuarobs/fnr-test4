import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import cliTruncate from 'cli-truncate';

interface IdCellProps {
  value: number;
}

export function IdCell({ value }: IdCellProps) {
  const stringValue = value.toString();

  if (stringValue.length <= 5) {
    return <div className="ml-4">{value}</div>;
  }

  return (
    <div className="ml-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {cliTruncate(stringValue, 5, { position: 'end' })}
          </TooltipTrigger>
          <TooltipContent>{value}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
