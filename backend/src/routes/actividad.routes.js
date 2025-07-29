"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorize }       from "../middlewares/authorization.middleware.js";
import {
  actualizarEstadoActividadController,
  createActividadController,
  deleteActividadController,
  getActividadByIdController,
  getAllActividadesController,
  updateActividadController,
} from "../controllers/actividad.controller.js";

const router = Router();
router.use(authenticateJwt);

// router
//   .use(authenticateJwt)
//   .use(isAdmin);

router
  .get("/", getAllActividadesController)
  .get("/:id", getActividadByIdController)
  .post("/", authorize("Presidente", "Secretario"), createActividadController)
  .put("/:id", authorize("Presidente", "Secretario"), updateActividadController)
  .delete("/:id", authorize("Presidente", "Secretario"), deleteActividadController)
  .patch("/:id/estado",authorize("Presidente", "Secretario"),  actualizarEstadoActividadController);

export default router;
