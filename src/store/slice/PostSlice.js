import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: {
    id: "",
    title: ""
  },
  images: [],
  imagesToDelete: [],
};

const PostSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostTitle: (state, action) => ({
      ...state,
      post: {
        ...state.post,
        title: action.payload
      }
    }),
    setPostData: (state, action) => ({
      ...state,
      post: action.payload,
    }),
    setPostImages: (state, action) => ({
      ...state,
      images: action.payload,
    }),
    setImagesToDelete: (state, action) => ({
      ...state,
      imagesToDelete: action.payload,
    }),
  },
});
export const { setPostTitle, setPostData, setPostImages, setImagesToDelete } = PostSlice.actions;
export default PostSlice.reducer;
