import { Item } from './item';
import { ITEM_KEYS } from './itemKeys';
import { ItemStatus } from './ItemStatus';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

// Define the common interface for status details
export interface StatusDetails {
  bgClass: string;
  textClass: string;
  text: string;
  tooltip: string;
}

// Define the function to get status details
export const getStatusDetails = (
  itemStatus: Item[typeof ITEM_KEYS.ITEM_STATUS]
): StatusDetails => {
  switch (itemStatus) {
    case ItemStatus.RS:
      return {
        bgClass: 'bg-red-200',
        textClass: 'text-red-800',
        text: 'RS',
        tooltip: 'Restorable',
      };
    case ItemStatus.NR:
      return {
        bgClass: 'bg-green-200',
        textClass: 'text-green-800',
        text: 'N/R',
        tooltip: 'Non-Restorable',
      };
    case ItemStatus.VPOL:
      return {
        bgClass: 'bg-purple-200',
        textClass: 'text-purple-800',
        text: 'VPOL',
        tooltip: 'Verbal Proof of Loss',
      };
    case ItemStatus.OTHER:
      return {
        bgClass: 'bg-blue-200',
        textClass: 'text-blue-800',
        text: 'Other',
        tooltip: 'Other Status',
      };
    default:
      return {
        bgClass: 'bg-gray-200',
        textClass: 'text-gray-600',
        text: '?',
        tooltip: 'Unknown Status',
      };
  }
};

type ItemStatusBadgeProps = {
  itemStatus: Item[typeof ITEM_KEYS.ITEM_STATUS];
  showTooltip?: boolean;
};

export const ItemStatusBadge = ({
  itemStatus,
  showTooltip = true,
}: ItemStatusBadgeProps) => {
  const statusDetails: StatusDetails = getStatusDetails(itemStatus);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusDetails.bgClass} ${statusDetails.textClass}`}
          >
            {statusDetails.text}
          </span>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent>
            <p>{statusDetails.tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
