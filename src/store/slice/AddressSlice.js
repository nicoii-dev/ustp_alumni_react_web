import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userRegion: "",
  userProvince: "",
  userCity: "",
  userBarangay: "",
  userStreet: "",
  userZipcode: ""
};

const AddressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setUserRegion: (state, action) => ({
      ...state,
      userRegion: action.payload,
    }),
    setUserProvince: (state, action) => ({
      ...state,
      userProvince: action.payload,
    }),
    setUserCity: (state, action) => ({
      ...state,
      userCity: action.payload,
    }),
    setUserBarangay: (state, action) => ({
      ...state,
      userBarangay: action.payload,
    }),
    setUserStreet: (state, action) => ({
      ...state,
      userStreet: action.payload,
    }),
    setUserZipcode: (state, action) => ({
      ...state,
      userZipcode: action.payload,
    }),
  },
});
export const { setUserRegion, setUserProvince, setUserCity, setUserBarangay, setUserStreet, setUserZipcode } = AddressSlice.actions;
export default AddressSlice.reducer;
