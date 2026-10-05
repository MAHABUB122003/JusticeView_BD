import api from './api';

export const thanaService = {
  getAll: (params) => api.get('/thanas', { params }),
  search: (params) => api.get('/thanas/search', { params }),
  getById: (id) => api.get(`/thanas/${id}`),
  getByDistrict: (districtId) => api.get(`/thanas/district/${districtId}`),
};
