import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import PostSlice from './slice/PostSlice';
import JobSlice from './slice/JobSlice';
import AnnouncementSlice from './slice/AnnouncementSlice';
import CommentSlice from './slice/CommentSlice';
import EmploymentStatusSlice from './slice/EmploymentStatusSlice';
import personalInfoSlice from './slice/personalInfoSlice';
import TrainingSlice from './slice/TrainingSlice';

const store = configureStore({
  reducer: {
    post: PostSlice,
    job: JobSlice,
    announcement: AnnouncementSlice,
    comment: CommentSlice,
    employment: EmploymentStatusSlice,
    personalInfo: personalInfoSlice,
    training: TrainingSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export default store;
