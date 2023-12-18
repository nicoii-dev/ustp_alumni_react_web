import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileSetup: {
    civil_status: "",
    dob: "",
  },
  image: [],
  profileImage: null
};

const SetupProfileSlice = createSlice({
  name: "profileSetup",
  initialState,
  reducers: {
    setProfileSetup: (state, action) => ({
      ...state,
      profileSetup: action.payload,
    }),
    setImage: (state, action) => ({
      ...state,
      image: action.payload,
    }),
    setProfileImage: (state, action) => ({
      ...state,
      profileImage: action.payload,
    }),
  },
});
export const { setProfileSetup, setImage, setProfileImage } = SetupProfileSlice.actions;
export default SetupProfileSlice.reducer;
