import api from './api.js';
export async function createMeta(data) {
  const { data: response } = await api.post('/metaf/', data);
  return response;
}

export async function getMeta(id) {
  const { data: response } = await api.get(`/metaf/detail/?id=${id}`);
  return response;
}

export async function updateMeta(id, data) {
  const { data: response } = await api.patch(`/metaf/detail/?id=${id}`, data);
  return response;
}

export async function deleteMeta(id) {
  const { data: response } = await api.delete(`/metaf/detail/?id=${id}`);
  return response;
}

export async function getAllMetas() {
  const { data: response } = await api.get('/metaf/');
  return response;
}

export async function getMetasByYear(year) {
  const { data: response } = await api.get(`/metaf/by-year/?year=${year}`);
  return response;
}