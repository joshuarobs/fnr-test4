import React from 'react';
import { ReceiptIcon } from './ReceiptIcon';

interface InsuredsQuoteCellProps {
  oisQuote: number | null;
  receiptPhotoUrl?: string;
}

export const InsuredsQuoteCell = ({
  oisQuote,
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
      {oisQuote !== null ? <span>${oisQuote}</span> : ''}
    </div>
  </div>
);
