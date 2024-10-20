import React from 'react';
import { GreenTickIcon } from './GreenTickIcon';
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
      <div>
        <ReceiptIcon />
      </div>
    ) : (
      <div></div> // Empty div to maintain layout when there's no receipt icon
    )}
    <div className="flex items-center">
      {oisQuote !== null ? `${oisQuote}` : ''}
      <GreenTickIcon />
    </div>
  </div>
);
