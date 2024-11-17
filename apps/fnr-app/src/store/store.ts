import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import selectedCellReducer from './features/selectedCellSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    selectedCell: selectedCellReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
