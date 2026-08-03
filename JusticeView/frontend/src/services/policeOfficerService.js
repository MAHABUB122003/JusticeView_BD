import api from './api';

export const policeOfficerService = {
  getAll: (params) => api.get('/police-officers', { params }),
  search: (params) => api.get('/police-officers/search', { params }),
  getById: (id) => api.get(`/police-officers/${id}`),
  getByThana: (thanaId) => api.get(`/police-officers/thana/${thanaId}`),
};
