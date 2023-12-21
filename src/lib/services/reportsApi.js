/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getReports: () => apiService.get(`/reports`),
};
