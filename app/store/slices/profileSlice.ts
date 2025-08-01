import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  userName: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string | null;
  profilePic: { fileName: string; contentType: string; url: string } | null;
  tags: string[];
  attributes: any[]; // Adjust the type if you have a specific structure for attributes
}

const initialState: ProfileState = {
  userName: "",
  firstName: "",
  lastName: "",
  gender: "",
  phone: null,
  profilePic: null,
  tags: [],
  attributes: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      return { ...state, ...action.payload };
    },
    updateProfileField: (
      state,
      action: PayloadAction<{ field: keyof ProfileState; value: any }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    resetProfile: () => initialState,
  },
});

export const { setProfile, updateProfileField, resetProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
