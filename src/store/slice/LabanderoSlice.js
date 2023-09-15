import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: [],
  include: false,
  allLabandero: [],
};

const LabanderoSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setAllLabandero: (state, action) => ({
      ...state,
      allLabandero: action.payload,
    }),
    setProfile: (state, action) => ({
      ...state,
      profile: action.payload,
    }),
    removeProfile: (state, action) => ({
      ...state,
      profile: {},
    }),
    setInclude: (state, action) => ({
      ...state,
      include: action.payload,
    }),
  },
});
export const { setAllLabandero, setProfile, removeProfile, setInclude } = LabanderoSlice.actions;
export default LabanderoSlice.reducer;
