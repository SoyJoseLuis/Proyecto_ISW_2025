// src/services/api.js
import axios from 'axios';
import { notification } from 'antd';
import { getCurrentJwt } from '../helpers/auth.js';

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({ baseURL });




// Agrega el token JWT a cada petición
api.interceptors.request.use(config => {
  const jwt = getCurrentJwt();
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});





// Interceptor de errores global (solo para la instancia principal)
api.interceptors.response.use(
  res => res,
  err => {
    // Si es un 404, no mostrar notificación
    if (err.response?.status === 404) {
      return Promise.reject(err);
    }
    const description = err.response?.data?.message || err.message;
    notification.error({ message: 'Error', description });
    return Promise.reject(err);
  }
);

export default api;
