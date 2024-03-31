/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllComments: (id) => apiService.post(`/comment/view/${id}`),
  comment: (payload) => apiService.post(`/comment/create`, payload),
  updateComment: (id, payload) =>
    apiService.post(`/comment/update/${id}`, payload),
  deleteComment: (id) => apiService.delete(`/comment/delete/${id}`),
};
