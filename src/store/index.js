import { configureStore } from '@reduxjs/toolkit'
import PostSlice from './slice/PostSlice';
import JobSlice from './slice/JobSlice';

const store = configureStore({
  reducer: {
    post: PostSlice,
    job: JobSlice
  }
})

export default store;
