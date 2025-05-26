"use strict";
import { Router } from "express";
// import { authenticateJwt } from "../middlewares/authentication.middleware.js";
// import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  getAllEstadosActividadController,
  getEstadoActividadByIdController,
} from "../controllers/estadoActividad.controller.js";

const router = Router();

// Descomenta para proteger rutas
// router
//   .use(authenticateJwt)
//   .use(isAdmin);

router
  .get("/", getAllEstadosActividadController)
  .get("/:id", getEstadoActividadByIdController);

export default router;
