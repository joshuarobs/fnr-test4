/**
 * CellWrapper Component
 *
 * Purpose:
 * This component implements a Google Sheets-like click-to-select functionality for table cells.
 * When a cell is clicked, it displays a visual outline to indicate selection state.
 * Only one cell can be selected at a time across the entire table.
 *
 * Features:
 * - Adds clickable functionality to any cell content
 * - Uses Redux to manage global selection state
 * - Provides visual feedback through a blue outline when selected
 * - Maintains a clean, unobtrusive appearance when unselected
 * - Takes up full cell space for maximum click area while preserving content size
 *
 * Usage:
 * Wrap any cell content with this component to add selection functionality:
 * <CellWrapper rowId="row-1" columnId="name">
 *   <YourCellContent />
 * </CellWrapper>
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setSelectedCell,
  clearSelectedCell,
} from '../../store/features/selectedCellSlice';

interface CellWrapperProps {
  children: React.ReactNode;
  rowId: string;
  columnId: string;
}

export const CellWrapper = ({
  children,
  rowId,
  columnId,
}: CellWrapperProps) => {
  const dispatch = useDispatch();
  const selectedCell = useSelector(
    (state: RootState) => state.selectedCell.selectedCell
  );

  const isSelected =
    selectedCell.rowId === rowId && selectedCell.columnId === columnId;

  const handleClick = () => {
    if (isSelected) {
      // If clicking the already selected cell, deselect it
      dispatch(clearSelectedCell());
    } else {
      // Select this cell and automatically deselect any other cell
      dispatch(setSelectedCell({ rowId, columnId }));
    }
  };

  return (
    <div
      onClick={handleClick}
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
