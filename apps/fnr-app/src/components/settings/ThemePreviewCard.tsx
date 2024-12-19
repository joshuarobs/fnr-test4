import React from 'react';
import { RadioGroup, RadioGroupItem, Separator } from '@react-monorepo/shared';

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
  return (
    <RadioGroup value={selected ? label : ''} onValueChange={onSelect}>
      <div className="w-fit rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden cursor-pointer">
        <div>{themePreview}</div>
        <Separator />
        <div className="px-4 py-3 flex items-center gap-2">
          <RadioGroupItem value={label} id={label} className="h-4 w-4" />
          <p className="text-sm font-medium">{label}</p>
        </div>
      </div>
    </RadioGroup>
  );
};
