
import api from './api.js';
/**
 * Genera un token de asistencia.
 */
export async function generateToken(idActividad) {
  const { data } = await api.post(`/asistencia/${idActividad}/token`);
  // data === { token: 1234 }
  return data.token;
}



/**
 * Pregunta al backend por el token activo */
 
export async function getCurrentToken(idActividad) {
  const { data } = await api.get(`/asistencia/${idActividad}/token`);
  // data === { token: 1234 }
  return data.token;
}   


/**
 * Envía un token para marcar asistencia (estudiante)
 */
export async function submitToken(idActividad, tokenCode) {
  const { data } = await api.post(`/asistencia/${idActividad}/submit-token`,
    { token: tokenCode }
  );
  // data === { message: "Token recibido, espera confirmación" }
  return data.message;
}

/**
 * Obtiene la lista de envíos pendientes (dobleConfirmación = false)
 */
export async function listPending(idActividad) {
  const { data } = await api.get(`/asistencia/${idActividad}/pending`);
  // data === { pendientes: [...] }
  return data.pendientes;
}

/**
 * Confirma o no confirma la asistencia de un estudiante
 */
export async function confirmAttendance(idActividad, rutEstudiante, confirm) {
  const { data } = await api.patch(`/asistencia/${idActividad}/${rutEstudiante}`,
    { confirm }
  );
  // data === { message, record }
  return data.record;
}

/**
 * Obtiene la lista definitiva de asistencias (dobleConfirmación = true).
 */
export async function listAll(idActividad) {
  const { data } = await api.get(`/asistencia/${idActividad}`);
  // data === { asistencia: [...] }
  return data.asistencia;
}



/**
 * Envia un token globalmente (sin idActividad).
 */

export async function submitTokenGlobal(tokenCode) {
  const { data } = await api.post(`/asistencia/submit-token`,{ token: tokenCode }    // solo el token numérico
  );
  return data.message;
}