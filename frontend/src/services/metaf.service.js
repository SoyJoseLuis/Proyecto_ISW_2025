import axios from './root.service.js';

export async function createMeta(data) {
  try {
    console.log('🔍 metaf.service - createMeta iniciado con data:', data);
    const response = await axios.post('/metaf/', data);
    console.log(' metaf.service - createMeta response completa:', response);
    console.log(' metaf.service - createMeta data:', response.data);
    return response.data;
  } catch (error) {
    console.error(' metaf.service - createMeta error:', error);
    console.error(' metaf.service - createMeta error.response:', error.response);
    console.error(' metaf.service - createMeta error.response.data:', error.response?.data);
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
    console.log('🔍 metaf.service - getAllMetas iniciado');
    const response = await axios.get('/metaf/');
    console.log(' metaf.service - getAllMetas response completa:', response);
    console.log(' metaf.service - getAllMetas status:', response.status);
    console.log(' metaf.service - getAllMetas data:', response.data);
    console.log(' metaf.service - getAllMetas data.status:', response.data.status);
    console.log(' metaf.service - getAllMetas data.data:', response.data.data);
    console.log(' metaf.service - getAllMetas data.data length:', response.data.data?.length);
    return response.data;
  } catch (error) {
    console.error(' metaf.service - getAllMetas error:', error);
    console.error(' metaf.service - getAllMetas error.response:', error.response);
    console.error(' metaf.service - getAllMetas error.response.data:', error.response?.data);
    return error.response.data;
  }
}

export async function getMetasByYear(year) {
  try {
    console.log('🔍 metaf.service - getMetasByYear iniciado con año:', year);
    const response = await axios.get(`/metaf/by-year/?year=${year}`);
    console.log(' metaf.service - getMetasByYear response completa:', response);
    console.log(' metaf.service - getMetasByYear status:', response.status);
    console.log(' metaf.service - getMetasByYear data:', response.data);
    console.log(' metaf.service - getMetasByYear data.status:', response.data.status);
    console.log(' metaf.service - getMetasByYear data.data:', response.data.data);
    console.log(' metaf.service - getMetasByYear data.data length:', response.data.data?.length);
    return response.data;
  } catch (error) {
    console.error(' metaf.service - getMetasByYear error:', error);
    console.error(' metaf.service - getMetasByYear error.response:', error.response);
    console.error(' metaf.service - getMetasByYear error.response.data:', error.response?.data);
    return error.response.data;
  }
} 