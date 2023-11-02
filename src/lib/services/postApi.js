/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllPost: () => apiService.get(`/post`),
  createPost: (payload) => {
    apiService.post(`/post/create`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${token}`,
      },
    });
  },
  updatePost: (payload) => {
    apiService.post(`/post/create`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${token}`,
      },
    });
  },
  deletePost: (id) => apiService.post(`/post/delete/${id}`),
  likePost: (payload) => apiService.post(`/likes/like-post`, payload),
  unlikePost: (id, payload) => apiService.post(`/likes/unlike-post/${id}`, payload),
};
