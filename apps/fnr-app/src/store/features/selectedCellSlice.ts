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
  },
});

export const { setSelectedCell } = selectedCellSlice.actions;
export default selectedCellSlice.reducer;
