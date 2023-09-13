import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  service: []
};

const ServiceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setService: (state, action) => ({
      ...state,
      service: action.payload,
    }),
    removeService: (state, action) => ({
      ...state,
      service: {},
    }),
  },
});
export const { setService, removeService } = ServiceSlice.actions;
export default ServiceSlice.reducer;
