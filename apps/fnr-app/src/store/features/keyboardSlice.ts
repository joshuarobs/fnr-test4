import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KeyboardState {
  isEnabled: boolean;
  activeBindings: string[];
}

const initialState: KeyboardState = {
  isEnabled: true,
  activeBindings: [],
};

const keyboardSlice = createSlice({
  name: 'keyboard',
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
