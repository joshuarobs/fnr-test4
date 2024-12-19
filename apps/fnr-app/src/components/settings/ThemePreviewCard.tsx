import React from 'react';
import { Separator } from '@react-monorepo/shared';
import { CustomRadioButton } from '../contents-table/shared/CustomRadioButton';

// Props interface for the ThemePreviewCard component
interface ThemePreviewCardProps {
  themePreview: React.ReactNode; // The theme preview SVG component
  label: string; // Label to display in the footer
  selected?: boolean; // Whether this theme is currently selected
  onSelect?: (value: string) => void; // Callback when this theme is selected, receives the selected value
}

// Custom card component that wraps theme preview SVGs with a consistent layout
export const ThemePreviewCard = ({
  themePreview,
  label,
  selected = false,
  onSelect,
}: ThemePreviewCardProps) => {
  // Handler for clicking anywhere on the card
  const handleCardClick = () => {
    onSelect?.(label);
  };

  return (
    <div
      className="w-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="select-none w-full">
        <div className="relative w-full">
          <div className="w-full h-auto">{themePreview}</div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>
      </div>
      <Separator />
      <CustomRadioButton
        value={label}
        selectedValue={selected ? label : ''}
        onChange={(value) => onSelect?.(value)}
        label={<p className="text-sm font-medium">{label}</p>}
        className="px-4 py-3"
        disableHover
      />
    </div>
  );
};
