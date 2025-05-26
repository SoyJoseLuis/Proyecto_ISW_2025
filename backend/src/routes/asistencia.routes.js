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
 * Gernera un token de asistencia para una actividad
 *    Solo para usuarios autorizados 
 *    Devuelve un código numérico para que los estudiantes lo ingresen
 */
router.post("/:idActividad/token", generateToken);

/**
 * el estudiante envía el token para marcarse presente
 *    Body{ rutEstudiante, token }
 *    crea un registro en AsistenciaActividad con dobleConfirmacion =falso
 */
router.post("/:idActividad/submit-token", submitToken);

/**
 * Presidente ve la lista de tokens entregados (pendientes de colocar true en dobleConfirmacio)
 *    Verá la lista con los que colocaron el token, peero, aparecerán con dobleConfirmacion = falso
 */
router.get("/:idActividad/pending", listPending);

/**
 * presidente confirma o elimina si está un estudiante
 *    Parametros que recibe-> idActividad, rutEstudiante
 *    Body-> { confirm: true o falso}
 *    Actualiza la dobleConfirmacion en la lista
 */
router.patch("/:idActividad/:rutEstudiante", confirmAttendance);

/**
 *  oAhora ve y obtiene la lista final de asistencia (todos los estudiantes, pero solo con la dobleConfirmacion en true)
 */
router.get("/:idActividad", listAll);

export default router;
