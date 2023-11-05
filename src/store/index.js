import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import PostSlice from './slice/PostSlice';
import JobSlice from './slice/JobSlice';
import AnnouncementSlice from './slice/AnnouncementSlice';

const store = configureStore({
  reducer: {
    post: PostSlice,
    job: JobSlice,
    announcement: AnnouncementSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export default store;
