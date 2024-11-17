import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedCellState {
  // Store row and column identifiers to uniquely identify the selected cell
  selectedCell: {
    rowId: string | null;
    columnId: string | null;
  };
}

const initialState: SelectedCellState = {
  selectedCell: {
    rowId: null,
    columnId: null,
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
      state.selectedCell = action.payload;
    },
    clearSelectedCell: (state) => {
      state.selectedCell = { rowId: null, columnId: null };
    },
  },
});

export const { setSelectedCell, clearSelectedCell } = selectedCellSlice.actions;
export default selectedCellSlice.reducer;
