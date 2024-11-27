import { Item } from '../item';
import { ITEM_KEYS } from '../itemKeys';

interface QuantityCellProps {
  item: Item;
}

export const QuantityCell = ({ item }: QuantityCellProps) => {
  const quantity = item[ITEM_KEYS.QUANTITY] as number;

  return <div className="flex items-center justify-end w-full">{quantity}</div>;
};
