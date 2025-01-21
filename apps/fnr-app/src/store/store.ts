import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import { activitiesApi } from './services/activitiesApi';
import selectedCellReducer from './features/selectedCellSlice';
import keyboardReducer from './features/keyboardSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [activitiesApi.reducerPath]: activitiesApi.reducer,
    selectedCell: selectedCellReducer,
    keyboard: keyboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, activitiesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
