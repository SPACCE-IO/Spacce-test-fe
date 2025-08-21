import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMission: null,
};

const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    setCurrentMission: (state, action) => {
      state.currentMission = action.payload;
    },

    clearCurrentMission: (state) => {
      state.currentMission = null;
    },
  },
});

export const { setCurrentMission, clearCurrentMission } = missionSlice.actions;

export const selectCurrentMission = (state: any) =>
  state.mission.currentMission;

export default missionSlice.reducer;
