import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shop: []
};

const ShopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShop: (state, action) => ({
      ...state,
      shop: action.payload,
    }),
    removeShop: (state, action) => ({
      ...state,
      shop: {},
    }),
  },
});
export const { setShop, removeShop } = ShopSlice.actions;
export default ShopSlice.reducer;
