import api from './api';

export const professionalService = {
  getAll: (params) => api.get('/professionals', { params }),
  search: (params) => api.get('/professionals/search', { params }),
  getById: (id) => api.get(`/professionals/${id}`),
  getByRole: (role, params) => api.get(`/professionals/role/${role}`, { params }),
  getStats: () => api.get('/professionals/stats'),
  create: (data) => api.post('/professionals', data),
  update: (id, data) => api.put(`/professionals/${id}`, data),
  remove: (id) => api.delete(`/professionals/${id}`),
  uploadPhoto: (id, formData) => api.post(`/professionals/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  submitVerification: (data) => api.post('/professionals/verification', data),
  reviewVerification: (id, data) => api.put(`/professionals/verification/${id}`, data),
  getVerificationRequests: (params) => api.get('/professionals/verification-requests', { params }),
};
