import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: {
    street: '',
    barangay: '',
    formattedAddress: '',
    zipcode: '',
    location: {
        lat: '',
        lng: ''
    },
  },
};

const AddressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action) => ({
      ...state,
      address: action.payload,
    }),
    removeAddress: (state, action) => ({
      ...state,
      address: {},
    }),
  },
});
export const { setAddress, removeAddress } = AddressSlice.actions;
export default AddressSlice.reducer;
