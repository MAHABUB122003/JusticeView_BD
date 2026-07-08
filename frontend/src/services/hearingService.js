import api from './api';

export const hearingService = {
  getAll: (params) => api.get('/hearings', { params }),
  getById: (id) => api.get(`/hearings/${id}`),
  getByCase: (caseId) => api.get(`/hearings/case/${caseId}`),
  getToday: () => api.get('/hearings/today'),
  create: (data) => api.post('/hearings', data),
  update: (id, data) => api.put(`/hearings/${id}`, data),
};
