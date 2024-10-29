import { QuoteDifferenceIcon } from '../contents-table/QuoteDifferenceIcon';

interface TotalCalculatedPriceTextProps {
  title?: string;
  value: number;
  oisquote?: number;
  ourquote?: number;
}

export const TotalCalculatedPriceText = ({
  title = 'Total',
  value,
  oisquote,
  ourquote,
}: TotalCalculatedPriceTextProps) => {
  const showQuoteDifference =
    oisquote !== undefined &&
    ourquote !== undefined &&
    oisquote > 1 &&
    ourquote > 1;

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

  return (
    <div>
      <small className="text-sm font-medium">{title}</small>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{formattedValue}</h2>
        {showQuoteDifference && (
          <QuoteDifferenceIcon oisquote={oisquote} ourquote={ourquote} />
        )}
      </div>
    </div>
  );
};
