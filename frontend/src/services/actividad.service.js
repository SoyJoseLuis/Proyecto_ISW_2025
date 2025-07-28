

import api from './api.js';  // 1) Usamos el mismo api.js con baseURL + interceptor JWT
import { normalizarTitulo } from '../hooks/NormalizadorTitulo/useNormalizador';

/**
 * Crea una nueva actividad.
 */
export async function crearActividad(data) {
  const payload = {
    ...data,
    tituloActividad: normalizarTitulo(data.tituloActividad),
  };

  try {
    // 2) POST /actividades
    const { data: res } = await api.post('/actividades', payload);
    // 3) Devolvemos el objeto creado que viene en res.data
    return res.data;
  } catch (err) {
    // 4) Mismo manejo de error que antes
    const msg = err.response?.data?.message || err.message;
    throw new Error(msg);
  }
}

/**
 * Obtiene todas las actividades.
 */
export async function getActividades() {
  try {
    // GET /actividades
    const { data: res } = await api.get('/actividades');
    // Devolvemos el array que está en res.data
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
}

/**
 * Actualiza únicamente el estado de una actividad.
 */
export async function actualizarEstadoActividad(idActividad, idEstadoActividad) {
  try {
    // PATCH /actividades/:id/estado
    const { data: res } = await api.patch(
      `/actividades/${idActividad}/estado`,
      { idEstadoActividad }
    );
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    throw new Error(msg);
  }
}

/**
 * Reemplaza completamente una actividad.
 */
export async function actualizarActividad(idActividad, data) {
  const payload = {
    ...data,
    tituloActividad: normalizarTitulo(data.tituloActividad),
  };

  try {
    // PUT /actividades/:id
    const { data: res } = await api.put(
      `/actividades/${idActividad}`,
      payload
    );
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    throw new Error(msg);
  }
}
/**
 * Obtener UNA actividad por ID
 */
export async function getActividadById(idActividad) {
  try {
    // GET /actividades/:id
    const { data: res } = await api.get(`/actividades/${idActividad}`);
    // res tiene la forma { status, message, data: { …actividad… } }
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    throw new Error(msg);
  }
}