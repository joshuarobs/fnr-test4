import { Item } from './item';

interface OurQuoteCellProps {
  item: Item;
}

export const OurQuoteCell = ({ item }: OurQuoteCellProps) => {
  const formattedQuote = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(item.ourquote);

  return <div className="text-right">{formattedQuote}</div>;
};
