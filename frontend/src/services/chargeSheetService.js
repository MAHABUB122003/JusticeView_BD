import api from './api';

export const chargeSheetService = {
  getAll: (params) => api.get('/charge-sheets', { params }),
  getById: (id) => api.get(`/charge-sheets/${id}`),
  getByCase: (caseId) => api.get(`/charge-sheets/case/${caseId}`),
  create: (data) => api.post('/charge-sheets', data),
  update: (id, data) => api.put(`/charge-sheets/${id}`, data),
  submitToCourt: (id) => api.put(`/charge-sheets/${id}/submit-to-court`),
};
