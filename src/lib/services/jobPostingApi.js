/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllJob: () => apiService.get(`/job-posting`),
  createJob: (token, payload) => {
    apiService.post(`job-posting/create`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
    });
  },
  updateJob: (id, payload) => {
    apiService.post(`/job-posting/update/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: "application/json",
      },
    });
  },
  deleteJob: (id) => apiService.delete(`/job-posting/delete/${id}`),
};
