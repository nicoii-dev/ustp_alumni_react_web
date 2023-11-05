import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  announcement: {
    id: '',
    title: '', 
    announcement: '',
    images: []
  },
  images: [],
  imagesToDelete: [],
};

const AnnouncementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    setAnnouncement: (state, action) => ({
      ...state,
      announcement: action.payload,
    }),
    setAnnouncementImages: (state, action) => ({
      ...state,
      images: action.payload,
    }),
    setImagesToDelete: (state, action) => ({
      ...state,
      imagesToDelete: action.payload,
    }),
  },
});
export const { setAnnouncement, setAnnouncementImages, setImagesToDelete } = AnnouncementSlice.actions;
export default AnnouncementSlice.reducer;
