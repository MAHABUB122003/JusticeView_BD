import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: (token) => api.post('/auth/refresh-token', { refreshToken: token }),
  changePassword: (data) => api.put('/auth/change-password', data),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};
