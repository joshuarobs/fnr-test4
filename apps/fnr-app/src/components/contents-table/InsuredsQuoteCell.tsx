import React from 'react';
import { GreenTickIcon } from './GreenTickIcon';

interface InsuredsQuoteCellProps {
  oisQuote: number;
}

export const InsuredsQuoteCell = ({ oisQuote }: InsuredsQuoteCellProps) => (
  <div className="flex items-center">
    {oisQuote}
    <GreenTickIcon />
  </div>
);
