/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllJob: () => apiService.get(`/job-posting`),
  createJob: (payload) => {
    apiService.post(`/job-posting/create`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${token}`,
      },
    });
  },
  updateJob: (payload) => {
    apiService.post(`/job-posting/create`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteJob: (id) => apiService.post(`/job-posting/delete/${id}`),
};
