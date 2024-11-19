import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAMES } from '../sliceNames';

interface KeyboardState {
  isEnabled: boolean;
  activeBindings: string[];
}

const initialState: KeyboardState = {
  isEnabled: true,
  activeBindings: [],
};

const keyboardSlice = createSlice({
  name: SLICE_NAMES.KEYBOARD,
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
    },
    addActiveBinding: (state, action: PayloadAction<string>) => {
      if (!state.activeBindings.includes(action.payload)) {
        state.activeBindings.push(action.payload);
      }
    },
    removeActiveBinding: (state, action: PayloadAction<string>) => {
      state.activeBindings = state.activeBindings.filter(
        (binding) => binding !== action.payload
      );
    },
  },
});

export const { setEnabled, addActiveBinding, removeActiveBinding } =
  keyboardSlice.actions;
export default keyboardSlice.reducer;
