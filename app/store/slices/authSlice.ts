/* eslint-disable require-jsdoc */
"use client";

import { createSlice } from "@reduxjs/toolkit";

type Role = "S" | "A" | "R" | "";

type StateType = {
  userRole: Role;
  userName: string | null;
  userId: number | null;
  orgCode: string | null;
  workspaceId: number | null;
  workspaceName: string;
  isAppError: boolean;
};

const initialState: StateType = {
  userRole: "",
  userName: null,
  userId: null,
  orgCode: null,
  workspaceId: null,
  workspaceName: "Select Workspace",
  isAppError: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userRole = action.payload.role;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.orgCode = action.payload.orgCode;
    },
    setWorkspace: (state, action) => {
      state.workspaceId = action.payload.id;
      state.workspaceName = action.payload.name;
    },
    setIsError: (state, action) => {
      state.isAppError = action.payload;
    },
    logout: (state) => {
      state.userRole = "";
      state.userName = null;
      state.userId = null;
      state.orgCode = null;
      state.workspaceId = null;
      state.workspaceName = "Select Workspace";
      
      // Clear localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("userToken");
      }
      
      // Clear cookies
      if (typeof document !== "undefined") {
        document.cookie = "userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
  },
});

export const { logout, setUser, setIsError, setWorkspace } = authSlice.actions;

export default authSlice.reducer;
