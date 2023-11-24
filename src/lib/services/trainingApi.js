/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getUserTraining: () => apiService.get(`/training/user`),
  createTraining: (payload) => apiService.post(`/training/create`, payload),
  updateTraining: (payload, id) => apiService.post(`/training/update/${id}`, payload),
  deleteTraining: (id) => apiService.delete(`/training/delete/${id}`),
};
