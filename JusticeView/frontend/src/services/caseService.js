import api from './api';

export const caseService = {
  getAll: (params) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  getByCriminal: (criminalId, params) => api.get(`/cases/criminal/${criminalId}`, { params }),
  getByThana: (thanaId, params) => api.get(`/cases/thana/${thanaId}`, { params }),
  getByCourt: (courtId, params) => api.get(`/cases/court/${courtId}`, { params }),
  getByOfficer: (officerId, params) => api.get(`/cases/officer/${officerId}`, { params }),
  getByStatus: (status, params) => api.get(`/cases/status/${status}`, { params }),
  search: (params) => api.get('/cases/search', { params }),
  create: (data) => api.post('/cases', data),
  update: (id, data) => api.put(`/cases/${id}`, data),
  delete: (id) => api.delete(`/cases/${id}`),
};
