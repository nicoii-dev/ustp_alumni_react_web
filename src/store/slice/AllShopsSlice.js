import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allShops: []
};

const AllShopSlice = createSlice({
  name: 'allShops',
  initialState,
  reducers: {
    setAllShop: (state, action) => ({
      ...state,
      allShops: action.payload,
    }),
    removeAllShop: (state, action) => ({
      ...state,
      allShops: {},
    }),
  },
});
export const { setAllShop, removeAllShop } = AllShopSlice.actions;
export default AllShopSlice.reducer;
