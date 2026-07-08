import api from './api';

export const courtService = {
  getAll: (params) => api.get('/courts', { params }),
  getById: (id) => api.get(`/courts/${id}`),
  getByDistrict: (districtId) => api.get(`/courts/district/${districtId}`),
};
