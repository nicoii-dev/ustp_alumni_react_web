import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  achievement: []
};

const Achievements = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    setAchievement: (state, action) => ({
      ...state,
      achievement: action.payload,
    }),
  },
});
export const { setAchievement } = Achievements.actions;
export default Achievements.reducer;
