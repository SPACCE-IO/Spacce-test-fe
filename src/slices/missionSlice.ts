import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMission: null,
  currentMissionReward:null
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
      state.currentMissionReward = null;
    },
    setCurrentMissionReward: (state, action) => {
      state.currentMissionReward = action.payload;
    },
  },
});

export const { setCurrentMission, clearCurrentMission ,setCurrentMissionReward} = missionSlice.actions;

export const selectCurrentMission = (state: any) =>
  state.mission.currentMission;

export default missionSlice.reducer;
