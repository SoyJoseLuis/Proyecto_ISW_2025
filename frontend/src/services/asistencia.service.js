
import axios from "axios";
 /*import { getCurrentRut } from "../helpers/auth.js";*/
 import { getCurrentJwt } from "../helpers/auth.js";

// Base c todos los endpoints de Asistencia
const BASE_URL = "http://localhost:4000/api/asistencia";


// Crea una instancia de axios para Asistencia
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(config => {
  const jwt = getCurrentJwt();
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});



/**
 * Genera un token de asistencia.
 */
export async function generateToken(idActividad) {
  const { data } = await api.post(`${BASE_URL}/${idActividad}/token`);
  // data === { token: 1234 }
  return data.token;
}



/**
 * Pregunta al backend por el token activo */
 
export async function getCurrentToken(idActividad) {
  const { data } = await api.get(`${BASE_URL}/${idActividad}/token`);
  // data === { token: 1234 }
  return data.token;
}   


/**
 * Envía un token para marcar asistencia (estudiante)
 */
export async function submitToken(idActividad, tokenCode) {
  const { data } = await api.post(
    `${BASE_URL}/${idActividad}/submit-token`,
    { token: tokenCode }
  );
  // data === { message: "Token recibido, espera confirmación" }
  return data.message;
}

/**
 * Obtiene la lista de envíos pendientes (dobleConfirmación = false)
 */
export async function listPending(idActividad) {
  const { data } = await api.get(`${BASE_URL}/${idActividad}/pending`);
  // data === { pendientes: [...] }
  return data.pendientes;
}

/**
 * Confirma o no confirma la asistencia de un estudiante
 */
export async function confirmAttendance(idActividad, rutEstudiante, confirm) {
  const { data } = await api.patch(
    `${BASE_URL}/${idActividad}/${rutEstudiante}`,
    { confirm }
  );
  // data === { message, record }
  return data.record;
}

/**
 * Obtiene la lista definitiva de asistencias (dobleConfirmación = true).
 */
export async function listAll(idActividad) {
  const { data } = await api.get(`${BASE_URL}/${idActividad}`);
  // data === { asistencia: [...] }
  return data.asistencia;
}



/**
 * Envia un token globalmente (sin idActividad).
 */

export async function submitTokenGlobal(tokenCode) {
  const { data } = await api.post(
    `/submit-token`,
    { token: tokenCode }    // solo el token numérico
  );
  return data.message;
}