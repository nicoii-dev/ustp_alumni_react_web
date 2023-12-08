import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trainings: [],
  training: {
    id: "",
    topic: "",
    title: "",
    date: "",
    duration: "",
    institution: "",
  },
};

const TrainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setTrainingsSetup: (state, action) => {
      if (state.trainings.length > 0) {
        const trainingsData = state.trainings.filter(
          (item) => item.id !== action.payload.id
        );
        return {
          ...state,
          trainings: [...trainingsData, action.payload],
        };
      }
      return {
        ...state,
        trainings: [...state.trainings, action.payload],
      };
    },
    setTraining: (state, action) => ({
      ...state,
      training: action.payload,
    }),
    removeTraining: (state, action) => {
      const trainingsData = state.trainings.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        trainings: trainingsData,
      };
    },
  },
});
export const { setTrainingsSetup, setTraining, removeTraining } =
  TrainingSlice.actions;
export default TrainingSlice.reducer;
