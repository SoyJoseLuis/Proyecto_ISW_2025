import api from './api.js';
export async function getAllBalances() {
  const { data: response } = await api.get('/balance/');
  return response;
}

export async function getCurrentBalance() {
  const { data: response } = await api.get('/balance/actual');
  return response;
}

export async function getBalanceById(id) {
  const { data: response } = await api.get(`/balance/detail/?id=${id}`);
  return response;
}

export async function getBalanceByPeriod(periodo) {
  const { data: response } = await api.get(`/balance/periodo/?periodo=${periodo}`);
  return response;
} 