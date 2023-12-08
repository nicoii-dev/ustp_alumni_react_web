import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  education: {}
};

const EducationalSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    setEducation: (state, action) => ({
      ...state,
      education: action.payload,
    }),
  },
});
export const { setEducation } = EducationalSlice.actions;
export default EducationalSlice.reducer;
