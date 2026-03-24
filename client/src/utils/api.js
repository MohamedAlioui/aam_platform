import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor — attach token from storage
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('aam-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.token) {
          config.headers['Authorization'] = `Bearer ${parsed.state.token}`;
        }
      }
    } catch (e) {
      // Silent fail
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aam-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
