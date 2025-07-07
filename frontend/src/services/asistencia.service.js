
import axios from "axios";

// Base c todos los endpoints de Asistencia
const BASE_URL = "http://146.83.198.35:1293/api/asistencia";

/**
 * Genera un token de asistencia.
 */
export async function generateToken(idActividad) {
  const { data } = await axios.post(`${BASE_URL}/${idActividad}/token`);
  // data === { token: 1234 }
  return data.token;
}



/**
 * Obtiene el token activo de una actividad pero tenemos que mejorarli
 */
export async function getCurrentToken(idActividad) {
  const { data } = await axios.get(`${BASE_URL}/${idActividad}/token`);
  // data === { token: 1234 }
  return data.token;
}


/**
 * Envía un token para marcar asistencia (estudiante)
 */
export async function submitToken(idActividad, tokenCode) {
  const { data } = await axios.post(
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
  const { data } = await axios.get(`${BASE_URL}/${idActividad}/pending`);
  // data === { pendientes: [...] }
  return data.pendientes;
}

/**
 * Confirma o no confirma la asistencia de un estudiante
 */
export async function confirmAttendance(idActividad, rutEstudiante, confirm) {
  const { data } = await axios.patch(
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
  const { data } = await axios.get(`${BASE_URL}/${idActividad}`);
  // data === { asistencia: [...] }
  return data.asistencia;
}
