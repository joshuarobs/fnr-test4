/**
 * CellWrapper Component
 *
 * Purpose:
 * This component implements a Google Docs-like click-to-select functionality for table cells.
 * When a cell is clicked, it displays a visual outline to indicate selection state.
 *
 * Features:
 * - Adds clickable functionality to any cell content
 * - Manages selection state internally using useState
 * - Provides visual feedback through a blue outline when selected
 * - Maintains a clean, unobtrusive appearance when unselected
 * - Takes up full cell space for maximum click area while preserving content size
 *
 * Usage:
 * Wrap any cell content with this component to add selection functionality:
 * <CellWrapper>
 *   <YourCellContent />
 * </CellWrapper>
 *
 * Styling:
 * - Uses Tailwind classes for styling
 * - Adds subtle rounded corners for better visual appearance
 * - Fills entire cell space while maintaining content positioning
 * - Uses thicker inset outline (3px) when selected
 */

import React, { useState } from 'react';

interface CellWrapperProps {
  children: React.ReactNode;
}

export const CellWrapper: React.FC<CellWrapperProps> = ({ children }) => {
  // Track selection state for this cell
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      onClick={() => setIsSelected(!isSelected)}
      className={`cursor-pointer rounded-sm h-full w-full flex items-center p-2 ${
        isSelected
          ? 'outline outline-2 outline-blue-500 outline-offset-[-1px]'
          : ''
      }`}
    >
      {children}
    </div>
  );
};
