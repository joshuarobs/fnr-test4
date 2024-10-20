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
    <div className="flex items-center">
      {oisQuote !== null ? `${oisQuote}` : ''}
      <GreenTickIcon />
    </div>
    {receiptPhotoUrl && receiptPhotoUrl !== '' && (
      <div className="ml-4">
        <ReceiptIcon />
      </div>
    )}
  </div>
);
