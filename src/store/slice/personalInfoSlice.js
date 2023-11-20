import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personalInfo: {
    civilStatus: "",
    dob: ""
  }
};

const PersonalInfoSlice = createSlice({
  name: "personalInfo",
  initialState,
  reducers: {
    setInfo: (state, action) => ({
      ...state,
      personalInfo: action.payload,
    }),
  },
});
export const { setInfo } = PersonalInfoSlice.actions;
export default PersonalInfoSlice.reducer;
