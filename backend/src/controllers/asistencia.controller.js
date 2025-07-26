// src/controllers/asistencia.controller.js
import * as asistenciaService from "../services/asistencia.service.js";
import { getCurrentTokenService } from "../services/asistencia.service.js";

import { AppDataSource } from "../config/configDb.js";
import TokenAsistencia from "../entity/token-asistencia.entity.js";
const tokenRepo = AppDataSource.getRepository(TokenAsistencia);


/**
 * POST /api/asistencia/:idActividad/token
 */
export const generateToken = async (req, res, next) => {
  const { idActividad } = req.params;

  try {
    const code = await asistenciaService.generateTokenService(idActividad);
    return res.json({ token: code });

  } catch (err) {
    next(err); // Pasamos el error al middleware de manejo de errores
  }
};


/**
 * GET /api/asistencia/:idActividad/pending
 */
export const listPending = async (req, res, next) => {
  const { idActividad } = req.params;
  try {
    const pendientes = await asistenciaService.listPendingService(idActividad);
    return res.json({ pendientes });
  } catch (err) {
    next(err); // Pasamos el error al middleware de manejo de errores
  }
};

/**
 * PATCH /api/asistencia/:idActividad/:rutEstudiante
 */
export const confirmAttendance = async (req, res, next) => {
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
    next(err); // Pasamos el error al middleware de manejo de errores
  }
};

/**
 * GET /api/asistencia/:idActividad
 */
export const listAll = async (req, res, next) => {
  const { idActividad } = req.params;
  try {
    const all = await asistenciaService.listAllService(idActividad);
    return res.json({ asistencia: all });
  } catch (err) {
    next(err); // Pasamos el error al middleware de manejo de errores
  }
};


 /**
  * GET /api/asistencia/:idActividad/token
  * Devuelve { token } o 404 si no hay token activo */
  
export const getCurrentToken = async (req, res, next) => {
  const { idActividad } = req.params;
  try {
    const code = await getCurrentTokenService(idActividad);
    // Si existe, devolvemos el token
    return res.json({ token: code });
  } catch (err) {
    next(err); // Pasamos el error al middleware de manejo de errores
  }
};


 /**
 * POST /api/asistencia/submit-token
 * Body: { token }
 * Autenticado con req.user.rutEstudiante
 */

export const submitTokenByCode = async (req, res, next) => {
  const { token } = req.body;
  const { rutEstudiante } = req.user;                 // ← de Passport

  // Validación mínima
  if (!token)
    return res.status(400).json({ error: "Token es requerido" });

  try {
    await asistenciaService.submitTokenByCodeService(token, rutEstudiante);
    return res.json({ message: "Asistencia marcada correctamente" });
  } catch (err) {
    next(err); // Pasamos el error al middleware de manejo de errores
  }
};