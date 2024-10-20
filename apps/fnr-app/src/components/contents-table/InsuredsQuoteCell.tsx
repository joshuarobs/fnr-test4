import React from 'react';
import { ReceiptIcon } from './ReceiptIcon';
import { QuoteDifferenceIcon } from './QuoteDifferenceIcon';

interface InsuredsQuoteCellProps {
  oisQuote: number | null;
  ourQuote: number | null;
  receiptPhotoUrl?: string;
}

export const InsuredsQuoteCell = ({
  oisQuote,
  ourQuote,
  receiptPhotoUrl,
}: InsuredsQuoteCellProps) => (
  <div className="flex items-center justify-between w-full">
    {receiptPhotoUrl && receiptPhotoUrl !== '' ? (
      <div className="mr-4">
        <ReceiptIcon />
      </div>
    ) : (
      <div></div> // Empty div to maintain layout when there's no receipt icon
    )}
    <div className="flex items-center">
      {oisQuote !== null ? <span className="mr-2">${oisQuote}</span> : ''}
      {oisQuote !== null && ourQuote !== null && (
        <QuoteDifferenceIcon oisquote={oisQuote} ourquote={ourQuote} />
      )}
    </div>
  </div>
);
