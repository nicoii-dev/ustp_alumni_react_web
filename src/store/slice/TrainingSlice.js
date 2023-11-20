import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    trainings: []
};

const TrainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setTrainings: (state, action) => ({
      ...state,
      trainings: action.payload,
    }),
  },
});
export const { setTrainings } = TrainingSlice.actions;
export default TrainingSlice.reducer;
