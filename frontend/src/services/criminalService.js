import api from './api';

export const criminalService = {
  getAll: (params) => api.get('/criminals', { params }),
  search: (params) => api.get('/criminals/search', { params }),
  getById: (id) => api.get(`/criminals/${id}`),
  getByNid: (nid) => api.get(`/criminals/nid/${nid}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/criminals', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/criminals', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/criminals/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/criminals/${id}`, data);
  },
  delete: (id) => api.delete(`/criminals/${id}`),
  uploadPhoto: (id, formData) => api.post(`/criminals/${id}/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getRepeatOffenders: (params) => api.get('/criminals/repeat-offenders', { params }),
};
