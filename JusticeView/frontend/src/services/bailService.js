import api from './api';

export const bailService = {
  getAll: (params) => api.get('/bail-records', { params }),
  getById: (id) => api.get(`/bail-records/${id}`),
  getByCriminal: (criminalId, params) => api.get(`/bail-records/criminal/${criminalId}`, { params }),
  getByCase: (caseId, params) => api.get(`/bail-records/case/${caseId}`, { params }),
  getByJudge: (judgeId, params) => api.get(`/bail-records/judge/${judgeId}`, { params }),
  getByLawyer: (lawyerId, params) => api.get(`/bail-records/lawyer/${lawyerId}`, { params }),
  search: (params) => api.get('/bail-records/search', { params }),
  create: (data) => api.post('/bail-records', data),
  update: (id, data) => api.put(`/bail-records/${id}`, data),
};
