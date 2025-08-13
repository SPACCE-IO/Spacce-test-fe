"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  currentPage: string;
  previousPage: string | null;
  isNavigating: boolean;
}

const initialState: NavigationState = {
  currentPage: "",
  previousPage: null,
  isNavigating: false,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.previousPage = state.currentPage;
      state.currentPage = action.payload;
      state.isNavigating = false;
    },
    setNavigating: (state, action: PayloadAction<boolean>) => {
      state.isNavigating = action.payload;
    },
    clearNavigationState: (state) => {
      state.currentPage = "";
      state.previousPage = null;
      state.isNavigating = false;
    },
  },
});

export const { setCurrentPage, setNavigating, clearNavigationState } = navigationSlice.actions;
export default navigationSlice.reducer; 