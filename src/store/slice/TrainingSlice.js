import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    trainings: [],
    training: {
      id: "",
      title: "",
      duration: "",
      institution: ""
    }
};

const TrainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setTrainingsSetup: (state, action) => {
      if(state.trainings.length > 0) {
        const test = state.trainings.filter(item => item.id !== action.payload.id)
        return ({
          ...state,
          trainings: [...test, action.payload],
        })
      }
      return ({
        ...state,
        trainings: [...state.trainings, action.payload],
      })
    },
    setTraining: (state, action) => ({
      ...state,
      training: action.payload,
    }),
  },
});
export const { setTrainingsSetup, setTraining } = TrainingSlice.actions;
export default TrainingSlice.reducer;
