import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employmentId: "",
  currentlyEmployed: "yes",
  type: "regular-permanent",
  currentOccupation: "",
  lineOfBusiness: "",
  stateOfReasons: [],
  profession: ""
};

const EmploymentStatusSlice = createSlice({
  name: "employmentStatus",
  initialState,
  reducers: {
    setEmploymentId: (state, action) => ({
      ...state,
      employmentId: action.payload,
    }),
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
    setProfession: (state, action) => ({
      ...state,
      profession: action.payload,
    }),
  },
});
export const {
  setEmploymentId,
  setStatus,
  setType,
  setOccupation,
  setReasons,
  setLineOfBusiness,
  setProfession
} = EmploymentStatusSlice.actions;
export default EmploymentStatusSlice.reducer;
