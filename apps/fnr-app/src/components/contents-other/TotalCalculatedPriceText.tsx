import { QuoteDifferenceIcon } from '../contents-table/QuoteDifferenceIcon';
import { WarningIconTooltip } from './WarningIconTooltip';

interface TotalCalculatedPriceTextProps {
  title?: string;
  value: number;
  insuredsQuote?: number;
  ourQuote?: number; // Fixed casing
  warningString?: string;
}

export const TotalCalculatedPriceText = ({
  title = 'Total',
  value,
  insuredsQuote,
  ourQuote, // Fixed casing
  warningString = '',
}: TotalCalculatedPriceTextProps) => {
  const showQuoteDifference =
    insuredsQuote !== undefined &&
    ourQuote !== undefined && // Fixed casing
    insuredsQuote > 1 &&
    ourQuote > 1; // Fixed casing

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

  return (
    <div>
      <div className="flex items-center gap-1">
        <small className="text-sm font-medium">{title}</small>
        {warningString && <WarningIconTooltip warningString={warningString} />}
      </div>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{formattedValue}</h2>
        {showQuoteDifference && (
          <QuoteDifferenceIcon
            insuredsQuote={insuredsQuote}
            ourQuote={ourQuote} // Fixed casing
            showDollarSign
          />
        )}
      </div>
    </div>
  );
};
