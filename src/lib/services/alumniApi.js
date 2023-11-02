/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  importCsv: (payload) => apiService.post(`/alumni/import-csv`, payload),
  getAllAlumni: () => apiService.get(`/alumni`),
};
