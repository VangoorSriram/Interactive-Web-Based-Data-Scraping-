import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const scrapeWebsite = (urls, element) => {
  return api.post('/scrape', { urls, element });
};

export const scrapeDynamicWebsite = (url, element) => {
  return api.post('/scrape-dynamic', { url, element });
};

export const fetchData = () => {
  return api.get('/data');
};

export const scheduleScraping = (url, interval) => {
  return api.post('/schedule', { url, interval });
};

export const loginUser = (username, password) => {
  return api.post('/login', { username, password });
};

export const registerUser = (username, password) => {
  return api.post('/register', { username, password });
};
