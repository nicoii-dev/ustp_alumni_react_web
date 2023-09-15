/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllServices: (payload) => apiService.get(`/services`, payload),
  getShopServices: (id) => apiService.post(`/services/shop/${id}`),
  createServices: (payload) => apiService.post(`/services/create`, payload),
  viewServices: (id) => apiService.get(`/services/view/${id}`),
  updateServices: (id, payload) => apiService.post(`/services/update/${id}`, payload),
  deleteServices: (id) => apiService.post(`/services/delete/${id}`),

  //   verifyEmail: (token, payload) => {
  //     apiService.post(`/auth/verify-email`, payload, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   },
};
