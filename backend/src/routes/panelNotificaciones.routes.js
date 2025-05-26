"use strict";
import { Router } from "express";
// import { authenticateJwt } from "../middlewares/authentication.middleware.js";
// import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
    createPanelNotificacionController,
    deletePanelNotificacionController,
    getAllPanelNotificacionesController,
    getPanelNotificacionesByEstudianteController,
  
} from "../controllers/panelNotificaciones.controller.js";

const router = Router();


// router
//   .use(authenticateJwt)
//   .use(isAdmin);

router
  .get("/", getAllPanelNotificacionesController)
  .get("/estudiante/:rutEstudiante", getPanelNotificacionesByEstudianteController)
  .post("/", createPanelNotificacionController)
  .delete("/:rutEstudiante/:idNotificacion", deletePanelNotificacionController);

export default router;
