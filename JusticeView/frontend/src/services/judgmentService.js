import api from './api';

export const judgmentService = {
  getAll: (params) => api.get('/judgments', { params }),
  getById: (id) => api.get(`/judgments/${id}`),
  getByCase: (caseId, params) => api.get(`/judgments/case/${caseId}`, { params }),
  getByCriminal: (criminalId, params) => api.get(`/judgments/criminal/${criminalId}`, { params }),
  search: (params) => api.get('/judgments/search', { params }),
  create: (data) => api.post('/judgments', data),
  update: (id, data) => api.put(`/judgments/${id}`, data),
};
