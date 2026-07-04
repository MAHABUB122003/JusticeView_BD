import api from './api';

export const divisionService = {
  getAll: () => api.get('/divisions'),
  getById: (id) => api.get(`/divisions/${id}`),
};

export const districtService = {
  getAll: (params) => api.get('/districts', { params }),
  getById: (id) => api.get(`/districts/${id}`),
  getByDivision: (divisionId) => api.get(`/districts/division/${divisionId}`),
};

export const thanaService = {
  getAll: (params) => api.get('/thanas', { params }),
  getById: (id) => api.get(`/thanas/${id}`),
  getByDistrict: (districtId) => api.get(`/thanas/district/${districtId}`),
  search: (params) => api.get('/thanas/search', { params }),
};
