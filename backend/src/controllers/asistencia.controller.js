// src/controllers/asistencia.controller.js
import * as asistenciaService from "../services/asistencia.service.js";
import { getCurrentTokenService } from "../services/asistencia.service.js";

/**
 * POST /api/asistencia/:idActividad/token
 */
export const generateToken = async (req, res) => {
  const { idActividad } = req.params;

  try {
    const code = await asistenciaService.generateTokenService(idActividad);
    return res.json({ token: code });

  } catch (err) {
    if (err.message === "ACTIVIDAD_NOT_FOUND") {
      return res.status(404).json({ error: "Actividad no existe" });
    }
    if (err.message === "TOKEN_ACTIVE_EXISTS") {
      return res
        .status(400)
        .json({ error: "Ya existe un token activo para esta actividad" });
    }
    // Otros errores imprevistos
    return res
      .status(500)
      .json({ error: "Error interno al generar token" });
  }
};

/**
 * POST /api/asistencia/:idActividad/submit-token
 */
export const submitToken = async (req, res) => {
  const { idActividad } = req.params;
  const { token }       = req.body;
  const { rutEstudiante } = req.user;
  try {
    await asistenciaService.submitTokenService(idActividad, rutEstudiante, token);
    return res.json({ message: "Token recibido, espera confirmación" });
  } catch (err) {
    if (err.message === "INVALID_TOKEN")
      return res.status(401).json({ error: "Token inválido o expirado" });
    if (err.message === "TOKEN_ALREADY_SUBMITTED")
      return res.status(200).json({ message: "Token ya entregado" });
    return res.status(500).json({ error: "Error interno al enviar token" });
  }
};

/**
 * GET /api/asistencia/:idActividad/pending
 */
export const listPending = async (req, res) => {
  const { idActividad } = req.params;
  try {
    const pendientes = await asistenciaService.listPendingService(idActividad);
    return res.json({ pendientes });
  } catch {
    return res.status(500).json({ error: "Error interno al listar pendientes" });
  }
};

/**
 * PATCH /api/asistencia/:idActividad/:rutEstudiante
 */
export const confirmAttendance = async (req, res) => {
  const { idActividad, rutEstudiante } = req.params;
  const { confirm } = req.body;
  try {
    const record = await asistenciaService.confirmAttendanceService(
      idActividad,
      rutEstudiante,
      confirm,
    );
    return res.json({ message: "Asistencia confirmada", record });
  } catch (err) {
    if (err.message === "RECORD_NOT_FOUND")
      return res.status(404).json({ error: "Registro no encontrado" });
    return res.status(500).json({ error: "Error interno al confirmar asistencia" });
  }
};

/**
 * GET /api/asistencia/:idActividad
 */
export const listAll = async (req, res) => {
  const { idActividad } = req.params;
  try {
    const all = await asistenciaService.listAllService(idActividad);
    return res.json({ asistencia: all });
  } catch {
    return res.status(500).json({ error: "Error interno al listar asistencias" });
  }
};




 /**
  * GET /api/asistencia/:idActividad/token
  * Devuelve { token } o 404 si no hay token activo */
  
 export const getCurrentToken = async (req, res) => {
   const { idActividad } = req.params;
   try {
    // implementación antigua o inexistente
    const code = await getCurrentTokenService(idActividad);
    return res.json({ token: code });
   } catch (err) {
     if (err.message === "TOKEN_NOT_FOUND") {
       return res.status(404).json({ error: "No hay token activo" });
     }
     return res.status(500).json({ error: "Error interno al leer token" });
   }
 };  





 /**
 * POST /api/asistencia/submit-token
 * Body: { token }
 * Autenticado con req.user.rutEstudiante
 */
export const submitTokenByCode = async (req, res) => {
  const { token } = req.body;
  const { rutEstudiante } = req.user;
  try {
    await asistenciaService.submitTokenByCodeService(token, rutEstudiante);
    return res.json({ message: "Asistencia marcada correctamente" });
  } catch (err) {
    if (err.message === "INVALID_TOKEN")
      return res.status(401).json({ error: "Token inválido o expirado" });
    return res.status(500).json({ error: "Error interno al enviar token" });
  }
};