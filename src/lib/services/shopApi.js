/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  getAllShops: (payload) => apiService.get(`/shops`, payload),
  getUserShops: (id) => apiService.post(`/shops/user/${id}`),
  createShop: (payload) => apiService.post(`/shops/create`, payload),
  viewShop: (id) => apiService.get(`/shops/view/${id}`),
  updateShop: (id, payload) => apiService.post(`/shops/update/${id}`, payload),
  deleteShop: (id) => apiService.post(`/shops/delete/${id}`),

  searchShops: (payload) => apiService.post(`/search`, payload),
  getAllServices: () => apiService.get(`/search/all`),
};
