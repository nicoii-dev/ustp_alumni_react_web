import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  images: [],
};

const PostSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostTitle: (state, action) => ({
      ...state,
      title: action.payload,
    }),
    removePostTitle: (state, action) => ({
      ...state,
      title: "",
    }),
    setPostImages: (state, action) => ({
      ...state,
      images: action.payload,
    }),
  },
});
export const { setPostTitle, removePostTitle, setPostImages } = PostSlice.actions;
export default PostSlice.reducer;
