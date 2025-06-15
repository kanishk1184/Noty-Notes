import axios from 'axios'


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Request interceptor
API.interceptors.request.use((config) => {
  
  if (config.url.startsWith('/auth')) {
    return config
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
});

export default API
