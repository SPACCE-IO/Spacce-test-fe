import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMission: null,
};

const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    // Set current mission
    setCurrentMission: (state, action) => {
      state.currentMission = action.payload;
    },

    // Clear current mission
    clearCurrentMission: (state) => {
      state.currentMission = null;
    },
  },
});

// Export actions
export const { setCurrentMission, clearCurrentMission } = missionSlice.actions;

// Selector
export const selectCurrentMission = (state: any) =>
  state.mission.currentMission;

// Export reducer
export default missionSlice.reducer;
