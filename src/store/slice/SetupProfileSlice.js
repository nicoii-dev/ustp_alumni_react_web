import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileSetup: {
    civil_status: "",
    dob: "",
  },
};

const SetupProfileSlice = createSlice({
  name: "profileSetup",
  initialState,
  reducers: {
    setProfileSetup: (state, action) => ({
      ...state,
      profileSetup: action.payload,
    }),
  },
});
export const { setProfileSetup } = SetupProfileSlice.actions;
export default SetupProfileSlice.reducer;
