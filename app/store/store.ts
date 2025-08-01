"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import tokenReducer from "./slices/tokenSlice";
import navigationReducer from "./slices/navigationSlice";
import { apiSlice } from "./slices/apiSlice";

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  token: tokenReducer,
  profile: profileReducer,
  navigation: navigationReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Check if we're in a browser environment
const isClient = typeof window !== "undefined";

// Configure persist settings only on the client side
const persistConfig = {
  key: "root", // Key to store in localStorage
  storage, // Use localStorage as storage
  whitelist: ["auth", "token", "workspace", "profile", "company"], // Specify which reducers to persist
};

// Create the Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

// Create the persistor for the store only on the client side
const persistor = isClient ? persistStore(store) : null;

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
