import { Item } from './placeholderContentsData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipSettings,
} from '@react-monorepo/shared';

// Define the common interface for status details
export interface StatusDetails {
  bgClass: string;
  textClass: string;
  text: string;
  tooltip: string;
}

// Define the function to get status details
export const getStatusDetails = (status: Item['status']): StatusDetails => {
  switch (status) {
    case 'RS':
      return {
        bgClass: 'bg-red-200',
        textClass: 'text-red-800',
        text: 'RS',
        tooltip: 'Restorable',
      };
    case 'NR':
      return {
        bgClass: 'bg-green-200',
        textClass: 'text-green-800',
        text: 'N/R',
        tooltip: 'Non-Restorable',
      };
    case 'VPOL':
      return {
        bgClass: 'bg-purple-200',
        textClass: 'text-purple-800',
        text: 'VPOL',
        tooltip: 'Verbal Proof of Loss',
      };
    default:
      return {
        bgClass: 'bg-gray-200',
        textClass: 'text-gray-600',
        text: '?',
        tooltip: '?',
      };
  }
};

type ItemStatusBadgeProps = {
  status: Item['status'];
};

export const ItemStatusBadge = ({ status }: ItemStatusBadgeProps) => {
  const statusDetails: StatusDetails = getStatusDetails(status);
  return (
    <TooltipProvider delayDuration={TooltipSettings.DelayDuration}>
      <Tooltip>
        <TooltipTrigger>
          {' '}
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusDetails.bgClass} ${statusDetails.textClass}`}
          >
            {statusDetails.text}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusDetails.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
