import api from './api';

export const evidenceService = {
  getAll: (params) => api.get('/evidence', { params }),
  getById: (id) => api.get(`/evidence/${id}`),
  getByCase: (caseId) => api.get(`/evidence/case/${caseId}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/evidence', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/evidence', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/evidence/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/evidence/${id}`, data);
  },
  submit: (id) => api.put(`/evidence/${id}/submit`),
  verify: (id) => api.put(`/evidence/${id}/verify`),
};
