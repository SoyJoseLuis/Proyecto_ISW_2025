// src/routes/asistencia.routes.js
"use strict";

import { Router } from "express";
import {
  generateToken,
  submitToken,
  listPending,
  confirmAttendance,
  listAll
} from "../controllers/asistencia.controller.js";

const router = Router();

/**
 * 1. Generar un token de asistencia para una actividad.
 *    - Solo usuarios autorizados (p.ej. presidente) deben llamar esto.
 *    - Devuelve un código numérico para que los estudiantes lo ingresen.
 */
router.post("/:idActividad/token", generateToken);

/**
 * 2. El estudiante envía el token para marcarse presente.
 *    - Body: { rutEstudiante, token }
 *    - Crea un registro en AsistenciaActividad con dobleConfirmacion=false.
 */
router.post("/:idActividad/submit-token", submitToken);

/**
 * 3. Presidente recupera la lista de tokens entregados (pendientes de confirmación).
 *    - Devuelve todos los registros con dobleConfirmacion = false.
 */
router.get("/:idActividad/pending", listPending);

/**
 * 4. Presidente confirma o deniega presencia de un estudiante.
 *    - Params: idActividad, rutEstudiante
 *    - Body: { confirm: true|false }
 *    - Actualiza dobleConfirmacion en el registro.
 */
router.patch("/:idActividad/:rutEstudiante", confirmAttendance);

/**
 * 5. Obtener la lista final de asistencia (todos los registros, con confirmaciones).
 */
router.get("/:idActividad", listAll);

export default router;
