import api from './api';

export const lawyerService = {
  getAll: (params) => api.get('/lawyers', { params }),
  search: (params) => api.get('/lawyers/search', { params }),
  getById: (id) => api.get(`/lawyers/${id}`),
  getTopActive: (params) => api.get('/lawyers/top-active', { params }),
  create: (data) => api.post('/lawyers', data),
  update: (id, data) => api.put(`/lawyers/${id}`, data),
};
