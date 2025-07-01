// store/index.ts - Updated with company data slice
import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './slices/companySlice';
import companyDataReducer from './slices/companyDataSlice'; // Add the new slice

export const store = configureStore({
  reducer: {
    company: companyReducer,
    companyData: companyDataReducer, // Add company data management
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;