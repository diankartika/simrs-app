import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://simrs-app.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me')
};

export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  search: (query) => api.get(`/patients/search/${query}`)
};

export const medicalRecordAPI = {
  getAll: () => api.get('/medical-records'),
  getByPatient: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  getById: (id) => api.get(`/medical-records/${id}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  delete: (id) => api.delete(`/medical-records/${id}`)
};

export const codingAPI = {
  getAll: () => api.get('/coding'),
  getByRecord: (recordId) => api.get(`/coding/record/${recordId}`),
  getById: (id) => api.get(`/coding/${id}`),
  create: (data) => api.post('/coding', data),
  update: (id, data) => api.put(`/coding/${id}`, data),
  validate: (id, data) => api.patch(`/coding/${id}/validate`, data),
  delete: (id) => api.delete(`/coding/${id}`)
};

export const reportAPI = {
  getMorbidity: () => api.get('/reports/morbidity'),
  getProcedures: () => api.get('/reports/procedures'),
  getQuality: () => api.get('/reports/quality'),
  getVisitSummary: () => api.get('/reports/patient-visits')
};

export default api;
