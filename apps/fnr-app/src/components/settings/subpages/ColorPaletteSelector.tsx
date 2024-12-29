import React from 'react';

// Colors that need a light grey outline for better visibility
const colorsWithOutline: AvatarColor[] = ['white'];

// Color mapping for avatar colors (Tailwind 500 variants to hex)
export const avatarColors = {
  black: '#000000',
  white: '#ffffff',
  gray: '#6B7280',
  red: '#EF4444',
  orange: '#F97316',
  amber: '#F59E0B',
  yellow: '#EAB308',
  lime: '#84CC16',
  green: '#22C55E',
  emerald: '#10B981',
  cyan: '#06B6D4',
  sky: '#0EA5E9',
  blue: '#3B82F6',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  purple: '#A855F7',
  fuchsia: '#D946EF',
  pink: '#EC4899',
  rose: '#F43F5E',
} as const;

export type AvatarColor = keyof typeof avatarColors;

interface ColorPaletteSelectorProps {
  selectedColor: AvatarColor;
  onColorSelect: (color: AvatarColor) => void;
}

// Component for selecting colors from a predefined palette
export const ColorPaletteSelector = ({
  selectedColor,
  onColorSelect,
}: ColorPaletteSelectorProps) => {
  return (
    <div className="grid grid-cols-8 w-[512px]">
      {(Object.keys(avatarColors) as AvatarColor[]).map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className="h-14 w-16 flex items-center justify-center"
          type="button"
          aria-label={`Select ${color} color`}
        >
          <div
            className={`h-10 w-12 rounded-lg transition-all ${
              colorsWithOutline.includes(color) && selectedColor !== color
                ? 'ring-1 ring-gray-200'
                : ''
            } ${
              selectedColor === color
                ? 'ring-2 ring-offset-2 ring-blue-500'
                : ''
            }`}
            style={{ backgroundColor: avatarColors[color] }}
          />
        </button>
      ))}
    </div>
  );
};
