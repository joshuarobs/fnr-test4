import React from 'react';

interface InsuredsQuoteCellProps {
  oisQuote: number;
}

export const InsuredsQuoteCell = ({ oisQuote }: InsuredsQuoteCellProps) => (
  <div>{oisQuote}</div>
);
