// src/routes/asistencia.routes.js
"use strict";


//Ahora que jaxon agregó el login, tenemos que hacer que c/u de mis rutas tenga la autenticacion del logeo
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorize }       from "../middlewares/authorization.middleware.js";


import { Router } from "express";
import {
  confirmAttendance,
  generateToken,
  getCurrentToken,
  listAll,
  listPending, 
  submitTokenByCode
} from "../controllers/asistencia.controller.js";

const router = Router();


// A partir de acá tooodas las rutas requieren un JWT válido. No lo hacemos uno por uno porque es más facilito el proteger todo de golpe
router.use(authenticateJwt);



/**  
 * 1) Obtener token activo  
 */
// GET token activo (público o protegido según decidas)


router.get( "/:idActividad/token", authorize("Presidente", "Secretario"), getCurrentToken);

/**
 * Gernera un token de asistencia para una actividad
 *    Solo para usuarios autorizados 
 *    Devuelve un código numérico para que los estudiantes lo ingresen
 */
router.post("/:idActividad/token", authorize("Presidente", "Secretario"), generateToken);

/**
 * el estudiante envía el token para marcarse presente
 *    Body{ rutEstudiante, token }
 *    crea un registro en AsistenciaActividad con dobleConfirmacion =falso
 */
 // Nueva ruta “global”:
 router.post("/submit-token", submitTokenByCode); //Cualquiera puede enviar token, por lo que no necesita authorize

/**
 * Presidente ve la lista de tokens entregados (pendientes de colocar true en dobleConfirmacio)
 *    Verá la lista con los que colocaron el token, peero, aparecerán con dobleConfirmacion = falso
 */
router.get("/:idActividad/pending", authorize("Presidente", "Secretario"), listPending);

/**
 * presidente confirma o elimina si está un estudiante
 *    Parametros que recibe-> idActividad, rutEstudiante
 *    Body-> { confirm: true o falso}
 *    Actualiza la dobleConfirmacion en la lista
 */
router.patch("/:idActividad/:rutEstudiante",authorize("Presidente", "Secretario"), confirmAttendance);

/**
 *  oAhora ve y obtiene la lista final de asistencia (todos los estudiantes, pero solo con la dobleConfirmacion en true)
 */
router.get("/:idActividad", authorize("Presidente", "Secretario"), listAll);

export default router;
