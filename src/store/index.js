import { configureStore } from '@reduxjs/toolkit'
import AddressSlice from './slice/AddressSlice';
import AllShopsSlice from './slice/AllShopsSlice';
import LabanderoSlice from './slice/LabanderoSlice';
import ServiceSlice from './slice/ServiceSlice';
import ShopSlice from './slice/ShopSlice';

const store = configureStore({
  reducer: {
    address: AddressSlice,
    shop: ShopSlice,
    service: ServiceSlice,
    allShops: AllShopsSlice,
    profile: LabanderoSlice
  }
})

export default store;
