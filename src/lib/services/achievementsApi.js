/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllAchievements: () => apiService.get(`/achievements`),
  createAchievements: (payload) => apiService.post(`/achievements/create`, payload),
  updateAchievements: (payload, id) => apiService.post(`/achievements/update/${id}`, payload),
  deleteAchievements: (id) => apiService.delete(`/achievements/delete/${id}`),
};
