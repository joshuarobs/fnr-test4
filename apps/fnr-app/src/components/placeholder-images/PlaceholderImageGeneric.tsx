import { FaRegImage } from 'react-icons/fa6';
import { ItemCategory, categoryIcons } from '../contents-table/itemCategories';

interface PlaceholderImageGenericProps {
  color?: string;
  itemCategory?: ItemCategory;
}

export const PlaceholderImageGeneric = ({
  color = 'gray-400',
  itemCategory,
}: PlaceholderImageGenericProps) => {
  const Icon = itemCategory ? categoryIcons[itemCategory] : FaRegImage;

  return (
    <div
      className={`w-7 h-7 rounded-md bg-${color} flex items-center justify-center flex-shrink-0`}
    >
      <Icon className="text-white w-4 h-4" />
    </div>
  );
};
