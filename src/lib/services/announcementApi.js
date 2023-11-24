/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllAnnouncement: () => apiService.get(`/announcement`),
  createAnnouncement: (token, payload) => {
    apiService.post(`announcement/create`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
    });
  },
  updateAnnouncement: (id, payload) => {
    apiService.post(`/announcement/update/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: "application/json",
      },
    });
  },
  deleteAnnouncement: (id) => apiService.delete(`/announcement/delete/${id}`),
};
