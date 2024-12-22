import {
  ItemCategory,
  categoryIcons,
  NO_CATEGORY_VALUE,
  itemCategoryDisplayNames,
} from '../itemCategories';
import { FilterableDropdown } from './FilterableDropdown';

interface CategoryDropdownProps {
  selectedCategory: ItemCategory | null;
  onCategorySelect: (category: ItemCategory | null) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

// Item category specific implementation using FilterableDropdown
export const CategoryDropdown = ({
  selectedCategory,
  onCategorySelect,
  onOpenChange,
  defaultOpen,
  className,
}: CategoryDropdownProps) => {
  const renderTriggerContent = (category: ItemCategory | null) => {
    if (category === null) {
      return <div className="text-muted-foreground italic">No category</div>;
    }
    const Icon = categoryIcons[category];
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <span>{itemCategoryDisplayNames[category]}</span>
      </div>
    );
  };

  const renderItemContent = (category: ItemCategory) => {
    const Icon = categoryIcons[category];
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <span>{itemCategoryDisplayNames[category]}</span>
      </div>
    );
  };

  const renderNoValueContent = () => (
    <div className="flex items-center gap-2 text-muted-foreground italic">
      No category
    </div>
  );

  return (
    <FilterableDropdown
      selectedValue={selectedCategory}
      onValueSelect={onCategorySelect}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      className={className}
      values={Object.values(ItemCategory)}
      noValueOption={NO_CATEGORY_VALUE}
      filterPlaceholder="Filter categories..."
      renderTriggerContent={renderTriggerContent}
      renderItemContent={renderItemContent}
      renderNoValueContent={renderNoValueContent}
      getFilterText={(category) => itemCategoryDisplayNames[category]}
    />
  );
};
