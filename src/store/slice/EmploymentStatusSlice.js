import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentlyEmployed: "yes",
  type: "regular-permanent",
  currentOccupation: "",
  lineOfBusiness: "",
  stateOfReasons: [],
};

const EmploymentStatusSlice = createSlice({
  name: "employmentStatus",
  initialState,
  reducers: {
    setStatus: (state, action) => ({
      ...state,
      currentlyEmployed: action.payload,
    }),
    setType: (state, action) => ({
      ...state,
      type: action.payload,
    }),
    setOccupation: (state, action) => ({
      ...state,
      currentOccupation: action.payload,
    }),
    setLineOfBusiness: (state, action) => ({
      ...state,
      lineOfBusiness: action.payload,
    }),
    setReasons: (state, action) => ({
      ...state,
      stateOfReasons: action.payload,
    }),
  },
});
export const { setStatus, setType, setOccupation, setReasons, setLineOfBusiness } = EmploymentStatusSlice.actions;
export default EmploymentStatusSlice.reducer;
