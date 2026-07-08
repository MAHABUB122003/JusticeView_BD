import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const BASE_URL = API_URL.replace('/api', '');
export const UPLOADS_URL = `${BASE_URL}/uploads`;

export const getPhotoUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${UPLOADS_URL}${path.replace('/uploads', '')}`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
