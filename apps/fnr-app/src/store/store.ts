import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import selectedCellReducer from './features/selectedCellSlice';
import keyboardReducer from './features/keyboardSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    selectedCell: selectedCellReducer,
    keyboard: keyboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
