import api from './api';

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getCriminalStats: () => api.get('/analytics/criminal-stats'),
  getCaseTrends: (params) => api.get('/analytics/case-trends', { params }),
  getBailTrends: (params) => api.get('/analytics/bail-trends', { params }),
  getDistrictWise: () => api.get('/analytics/district-wise'),
  getThanaWise: () => api.get('/analytics/thana-wise'),
  getTopLawyers: () => api.get('/analytics/top-lawyers'),
  getTopJudges: () => api.get('/analytics/top-judges'),
  getRepeatOffenders: () => api.get('/analytics/repeat-offenders'),
  getBailSuccessRate: () => api.get('/analytics/bail-success-rate'),
};
