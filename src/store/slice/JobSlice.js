import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: '',
  description: '',
  images: [],
  job: {
    id: '',
    title: '', 
    description: '',
    images: []
  },
  imagesToDelete: [],
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
    setJob: (state, action) => ({
      ...state,
      job: action.payload,
    }),
    setImagesToDelete: (state, action) => ({
      ...state,
      imagesToDelete: action.payload,
    }),
  },
});
export const { setJobTitle, setJobDescription, setJobPostImages, setJob, setImagesToDelete } = JobPostSlice.actions;
export default JobPostSlice.reducer;
