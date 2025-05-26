"use strict";
import { Router } from "express";
// import { authenticateJwt } from "../middlewares/authentication.middleware.js";
// import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  getAllTiposActividadController,
  getTipoActividadByIdController,
} from "../controllers/tipoActividad.controller.js";

const router = Router();

// Descomenta para proteger rutas
// router
//   .use(authenticateJwt)
//   .use(isAdmin);

router
  .get("/", getAllTiposActividadController)
  .get("/:id", getTipoActividadByIdController);

export default router;
