import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    selectedPost: null,
  },
  reducers: {
    setPost: (state, action) => {
      state.posts = action.payload || []; // Ensures posts is always an array
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload || null; // Ensures selectedPost is not undefined
    },
  },
});

export const { setPost, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
