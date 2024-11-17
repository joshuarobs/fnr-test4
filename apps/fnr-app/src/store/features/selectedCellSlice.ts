import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITEM_KEYS } from '../../components/contents-table/itemKeys';

interface SelectedCellState {
  // Store row and column identifiers to uniquely identify the selected cell
  selectedCell: {
    rowId: string;
    columnId: string;
  };
}

// Default to first row and first column (localId)
const initialState: SelectedCellState = {
  selectedCell: {
    rowId: '1', // First row ID
    columnId: ITEM_KEYS.LOCAL_ID, // First column ID
  },
};

export const selectedCellSlice = createSlice({
  name: 'selectedCell',
  initialState,
  reducers: {
    setSelectedCell: (
      state,
      action: PayloadAction<{ rowId: string; columnId: string }>
    ) => {
      // Ensure we never set null values
      if (action.payload.rowId && action.payload.columnId) {
        state.selectedCell = action.payload;
      }
    },

    // Move selection up one row, clamping to minimum of 1
    moveSelectionUp: (state) => {
      const currentRowId = parseInt(state.selectedCell.rowId);
      // Clamp to minimum of 1 (first row)
      const newRowId = Math.max(1, currentRowId - 1);
      state.selectedCell.rowId = newRowId.toString();
    },

    // Move selection down one row
    // Note: The maximum row will be handled by the component using this reducer
    // since it has access to the actual data length
    moveSelectionDown: (state, action: PayloadAction<{ maxRows: number }>) => {
      const currentRowId = parseInt(state.selectedCell.rowId);
      // Clamp to maximum number of rows
      const newRowId = Math.min(action.payload.maxRows, currentRowId + 1);
      state.selectedCell.rowId = newRowId.toString();
    },
  },
});

export const { setSelectedCell, moveSelectionUp, moveSelectionDown } =
  selectedCellSlice.actions;
export default selectedCellSlice.reducer;
