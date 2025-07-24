import axios from './root.service.js';

export async function createMeta(data) {
  try {
    const response = await axios.post('/metaf/', data);
    return response.data;
  } catch (error) {
    console.error('metaf.service - createMeta error:', error.response?.data || error.message);
    return error.response.data;
  }
}

export async function getMeta(id) {
  try {
    const response = await axios.get(`/metaf/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('metaf.service - getMeta error:', error.response?.data || error.message);
    return error.response.data;
  }
}

export async function updateMeta(id, data) {
  try {
    const response = await axios.patch(`/metaf/detail/?id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error('metaf.service - updateMeta error:', error.response?.data || error.message);
    return error.response.data;
  }
}

export async function deleteMeta(id) {
  try {
    const response = await axios.delete(`/metaf/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('metaf.service - deleteMeta error:', error.response?.data || error.message);
    return error.response.data;
  }
}

export async function getAllMetas() {
  try {
    const response = await axios.get('/metaf/');
    return response.data;
  } catch (error) {
    console.error('metaf.service - getAllMetas error:', error.response?.data || error.message);
    return error.response.data;
  }
}

export async function getMetasByYear(year) {
  try {
    const response = await axios.get(`/metaf/by-year/?year=${year}`);
    return response.data;
  } catch (error) {
    console.error('metaf.service - getMetasByYear error:', error.response?.data || error.message);
    return error.response.data;
  }
}