import api from './api.js';
export async function createTransaccion(data) {
  const { data: response } = await api.post('/transaccion/', data);
  return response;
}

export async function getTransacciones() {
  const { data: response } = await api.get('/transaccion/');
  return response;
}

export async function getTransaccion(id) {
  const { data: response } = await api.get(`/transaccion/detail/?id=${id}`);
  return response;
}

export async function deleteTransaccion(id) {
  const { data: response } = await api.delete(`/transaccion/detail/?id=${id}`);
  return response;
} 