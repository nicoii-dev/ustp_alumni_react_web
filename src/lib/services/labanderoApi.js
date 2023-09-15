/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  createProfile: (payload) => apiService.post(`/profile/create`, payload),
  updateProfile: (payload) => apiService.post(`/profile/update`, payload),
  viewProfile: () => apiService.post(`/profile/view`),

  getAllLabandero: () => apiService.get(`/search/labandero`),
};
