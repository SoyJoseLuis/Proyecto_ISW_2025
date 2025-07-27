"use strict";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorize } from "../middlewares/authorization.middleware.js";
import { Router } from "express";
import {
  createTransaccion,
  deleteTransaccion,
  getTransaccion,
  getTransacciones,
  
} from "../controllers/transaccion.controller.js";

// import { authenticateJwt } from "../middlewares/authentication.middleware.js";


const router = Router();
// Aplicar ambos middlewares a nivel de router
router.use(authenticateJwt);
router.use(authorize("Presidente", "Tesorero")); // Protege todas las rutas de una vez

router
  .post("/" , createTransaccion)
  .get("/", getTransacciones)
  .get("/detail/", getTransaccion )
  .delete("/detail/", deleteTransaccion )
export default router; 