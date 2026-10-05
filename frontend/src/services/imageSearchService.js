import axios from 'axios';
import { API_URL } from './api';

export const imageSearchService = {
  searchByImage: (formData) =>
    axios.post(`${API_URL}/image-search/search-by-image`, formData, {
      timeout: 60000,
    }),
  searchByDescriptor: (data) =>
    axios.post(`${API_URL}/image-search/search-by-descriptor`, data, {
      timeout: 10000,
    }),
  getMatchDetails: (id) =>
    axios.get(`${API_URL}/image-search/match/${id}`),
};
