/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllJobHistory: () => apiService.get(`/job-history`),
  getUserJobHistory: () => apiService.get(`/job-history/user`),
  createJobHistory: (payload) => apiService.post(`/job-history/create`, payload),
  updateJobHistory: (id, payload) => apiService.post(`/job-history/update/${id}`, payload),
  deleteJobHistory: (id) => apiService.post(`/job-history/delete/${id}`),
};
