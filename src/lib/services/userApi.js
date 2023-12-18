/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

export default {
  register: (payload) => apiService.post(`/auth/register`, payload),
  login: (payload) => apiService.post(`/auth/login`, payload),
  logout: () => apiService.post(`/auth/logout`, null),
  getUser: () => apiService.get(`/users`),
  updateUser: (id, payload) => apiService.put(`/update-user/${id}`, payload),
  updatePassword: (payload) => apiService.post(`/change-password`, payload),
  verifyEmail: (token, payload) => {
    apiService.post(`/auth/verify-email`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
  activateUser: (id) => apiService.post(`/users/activate/${id}`),
  deactivateUser: (id) => apiService.post(`/users/deactivate/${id}`),
  addProfileAddress: (payload) =>
    apiService.post(`/profile/add`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${token}`,
      },
    }),
  viewUser: (id) => apiService.post(`/users/view/${id}`),
  getProfile: () => apiService.get(`/profile`),
  updateProfile: (payload) =>
    apiService.post(`/profile/update`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${token}`,
      },
    }),
};
