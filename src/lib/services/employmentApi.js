/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllEmployment: () => apiService.get(`/employment`),
  getEmployment: () => apiService.get(`/employment/user`),
  createEmployment: (payload) => apiService.post(`/employment/create`, payload),
  updateEmployment: (id, payload) => apiService.post(`/employment/update/${id}`, payload),
};
