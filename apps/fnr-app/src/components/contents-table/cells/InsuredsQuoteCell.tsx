import { ReceiptIcon } from '../ReceiptIcon';

interface InsuredsQuoteCellProps {
  insuredsQuote: number | null;
  receiptPhotoUrl: string | null;
}

export const InsuredsQuoteCell = ({
  insuredsQuote,
  receiptPhotoUrl,
}: InsuredsQuoteCellProps) => (
  <div className="flex items-center justify-between w-full">
    <div className="mr-4">
      <ReceiptIcon receiptLink={receiptPhotoUrl} />
    </div>
    <div className="flex items-center">
      {insuredsQuote !== null ? <span>{insuredsQuote}</span> : ''}
    </div>
  </div>
);
