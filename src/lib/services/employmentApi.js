/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllEmployment: () => apiService.get(`/employment`),
  getEmployment: () => apiService.get(`/employment/user`),
  deleteAnnouncement: (id) => apiService.delete(`/announcement/delete/${id}`),
};
