import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  commentData: {}
};

const CommentSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    setComment: (state, action) => ({
      ...state,
      commentData: action.payload,
    }),
  },
});
export const { setComment } = CommentSlice.actions;
export default CommentSlice.reducer;
