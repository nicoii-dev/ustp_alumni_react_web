/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getUserEducation: () => apiService.get(`/education`),
  createEducation: (payload) => apiService.post(`/education/create`, payload),
  updateEducation: (id, payload) => apiService.post(`/education/update/${id}`, payload),
};
