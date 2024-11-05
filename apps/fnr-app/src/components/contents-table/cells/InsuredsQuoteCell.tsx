import React from 'react';
import { ReceiptIcon } from '../ReceiptIcon';

interface InsuredsQuoteCellProps {
  oisQuote: number | null;
  receiptPhotoUrl: string | null;
}

export const InsuredsQuoteCell = ({
  oisQuote,
  receiptPhotoUrl,
}: InsuredsQuoteCellProps) => (
  <div className="flex items-center justify-between w-full">
    <div className="mr-4">
      <ReceiptIcon receiptLink={receiptPhotoUrl} />
    </div>
    <div className="flex items-center">
      {oisQuote !== null ? <span>{oisQuote}</span> : ''}
    </div>
  </div>
);
