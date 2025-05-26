"use strict";
import { Router } from "express";
// import { authenticateJwt } from "../middlewares/authentication.middleware.js";
// import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  actualizarEstadoActividadController,
  createActividadController,
  deleteActividadController,
  getActividadByIdController,
  getAllActividadesController,
  updateActividadController,
} from "../controllers/actividad.controller.js";

const router = Router();


// router
//   .use(authenticateJwt)
//   .use(isAdmin);

router
  .get("/", getAllActividadesController)
  .get("/:id", getActividadByIdController)
  .post("/", createActividadController)
  .put("/:id", updateActividadController)
  .delete("/:id", deleteActividadController)
  .patch("/:id/estado", actualizarEstadoActividadController);

export default router;
