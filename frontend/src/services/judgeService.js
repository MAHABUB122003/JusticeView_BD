import api from './api';

export const judgeService = {
  getAll: (params) => api.get('/judges', { params }),
  getById: (id) => api.get(`/judges/${id}`),
  getByCourt: (courtId, params) => api.get(`/judges/court/${courtId}`, { params }),
  getTopBail: (params) => api.get('/judges/top-bail', { params }),
  create: (data) => api.post('/judges', data),
  update: (id, data) => api.put(`/judges/${id}`, data),
};
