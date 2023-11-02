import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: '',
  description: '',
  images: [],
};

const JobPostSlice = createSlice({
  name: "jobPost",
  initialState,
  reducers: {
    setJobTitle: (state, action) => ({
      ...state,
      title: action.payload,
    }),
    setJobDescription: (state, action) => ({
      ...state,
      description: action.payload
    }),
    setJobPostImages: (state, action) => ({
      ...state,
      images: action.payload,
    }),
  },
});
export const { setJobTitle, setJobDescription, setJobPostImages } = JobPostSlice.actions;
export default JobPostSlice.reducer;
