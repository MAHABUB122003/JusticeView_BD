import api from './api';

export const punishmentService = {
  getAll: (params) => api.get('/punishments', { params }),
  getById: (id) => api.get(`/punishments/${id}`),
  getByCriminal: (criminalId, params) => api.get(`/punishments/criminal/${criminalId}`, { params }),
  create: (data) => api.post('/punishments', data),
  update: (id, data) => api.put(`/punishments/${id}`, data),
  release: (id, data) => api.put(`/punishments/${id}/release`, data),
};
