import axios from './root.service.js';

export async function getAllBalances() {
  try {
    const response = await axios.get('/balance/');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getCurrentBalance() {
  try {
    const response = await axios.get('/balance/actual');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getBalanceById(id) {
  try {
    const response = await axios.get(`/balance/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getBalanceByPeriod(periodo) {
  try {
    const response = await axios.get(`/balance/periodo/?periodo=${periodo}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
} 