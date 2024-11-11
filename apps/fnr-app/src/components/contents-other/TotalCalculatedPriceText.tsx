import { QuoteDifferenceIcon } from '../contents-table/QuoteDifferenceIcon';
import { IoWarning } from 'react-icons/io5';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

interface TotalCalculatedPriceTextProps {
  title?: string;
  value: number;
  insuredsQuote?: number;
  ourquote?: number;
  warningString?: string;
}

export const TotalCalculatedPriceText = ({
  title = 'Total',
  value,
  insuredsQuote,
  ourquote,
  warningString = '',
}: TotalCalculatedPriceTextProps) => {
  const showQuoteDifference =
    insuredsQuote !== undefined &&
    ourquote !== undefined &&
    insuredsQuote > 1 &&
    ourquote > 1;

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

  return (
    <div>
      <div className="flex items-center gap-1">
        <small className="text-sm font-medium">{title}</small>
        {warningString && (
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
        )}
      </div>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{formattedValue}</h2>
        {showQuoteDifference && (
          <QuoteDifferenceIcon
            insuredsQuote={insuredsQuote}
            ourquote={ourquote}
          />
        )}
      </div>
    </div>
  );
};
