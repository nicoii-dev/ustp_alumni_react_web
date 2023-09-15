/* eslint-disable import/no-anonymous-default-export */
import apiService from "./axios";

const headersApplicationJSON = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

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
};
