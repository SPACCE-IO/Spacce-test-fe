"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { apiSlice } from "../slices/apiSlice";

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Configure persist settings
const persistConfig = {
  key: "root", // Key to store in localStorage
  storage, // Use localStorage as storage
  whitelist: ["auth", "token", "workspace", "profile", "company"], // Specify which reducers to persist
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }).concat(apiSlice.middleware),
});

// Create the persistor for the store
const persistor = persistStore(store);

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
