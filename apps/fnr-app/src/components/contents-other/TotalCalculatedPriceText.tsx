import { QuoteDifferenceIcon } from '../contents-table/QuoteDifferenceIcon';
import { WarningIconTooltip } from './WarningIconTooltip';
import { formatNumberWithSmallDecimals } from '../contents-table/cells/tableCellsStyles';

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

  const formattedValue = (
    <span className="inline-flex items-center">
      <span className="text-[0.85em] pr-[1px]">$</span>
      {formatNumberWithSmallDecimals(value)}
    </span>
  );

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
