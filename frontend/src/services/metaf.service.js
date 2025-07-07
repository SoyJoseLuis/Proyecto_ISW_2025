import axios from './root.service.js';

export async function createMeta(data) {
  try {
    const response = await axios.post('/metaf/', data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getMeta(id) {
  try {
    const response = await axios.get(`/metaf/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function updateMeta(id, data) {
  try {
    const response = await axios.patch(`/metaf/detail/?id=${id}`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteMeta(id) {
  try {
    const response = await axios.delete(`/metaf/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getAllMetas() {
  try {
    const response = await axios.get('/metaf/');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getMetasByYear(year) {
  try {
    console.log('metaf.service - getMetasByYear called with year:', year);
    const response = await axios.get(`/metaf/by-year/?year=${year}`);
    console.log('metaf.service - getMetasByYear response:', response.data);
    return response.data;
  } catch (error) {
    console.error('metaf.service - getMetasByYear error:', error);
    return error.response.data;
  }
} 