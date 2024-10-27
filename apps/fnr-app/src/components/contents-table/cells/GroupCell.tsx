import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@react-monorepo/shared';
import cliTruncate from 'cli-truncate';

interface GroupCellProps {
  group: string;
}

export function GroupCell({ group }: GroupCellProps) {
  const truncatedGroup = cliTruncate(group, 15, { position: 'end' });
  const shouldShowTooltip = group.length > 15;

  const textStyle = {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  if (shouldShowTooltip) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={350}>
          <TooltipTrigger asChild>
            <div style={textStyle}>{truncatedGroup}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{group}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <div style={textStyle}>{truncatedGroup}</div>;
}
