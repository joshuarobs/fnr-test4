interface TotalCalculatedPriceTextProps {
  title?: string;
  value: number;
  difference: number;
}

export const TotalCalculatedPriceText = ({
  title = 'Total',
  value,
  difference,
}: TotalCalculatedPriceTextProps) => {
  return (
    <div>
      <small className="text-sm font-medium">{title}</small>
      <h2 className="text-lg font-semibold">{value}</h2>
    </div>
  );
};
