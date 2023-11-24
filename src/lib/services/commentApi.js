/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllComments: (id) => apiService.post(`/comment/view/${id}`),
  comment: (payload) => apiService.post(`/comment/create`, payload),
};
