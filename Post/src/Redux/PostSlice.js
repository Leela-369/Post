import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    createPost: (state, action) => {
      state.posts.push(action.payload);
    },
    likePost: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.likes += 1;
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    updateCommentInput: (state, action) => {
      const { postId, value } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.commentInput = value;
      }
    },
    sharePost: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.shares += 1;
      }
    },
  },
});

export const { createPost, likePost, addComment, updateCommentInput, sharePost } = postSlice.actions;

export default postSlice.reducer;
