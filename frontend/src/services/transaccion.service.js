import axios from './root.service.js';

export async function createTransaccion(data) {
  try {
    const response = await axios.post('/transaccion/', data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getTransacciones() {
  try {
    const response = await axios.get('/transaccion/');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getTransaccion(id) {
  try {
    const response = await axios.get(`/transaccion/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteTransaccion(id) {
  try {
    const response = await axios.delete(`/transaccion/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
} 