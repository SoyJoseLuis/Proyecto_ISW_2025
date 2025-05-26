"use strict";
import { Router } from "express";
import {
  createTransaccion,
  deleteTransaccion,
  getTransaccion,
  getTransacciones,
  
} from "../controllers/transaccion.controller.js";
// para cuendo se tenga la logica del los roles asignados que podran acceder a esta ruta
// import { authenticateJwt } from "../middlewares/authentication.middleware.js";
// import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();
// para cuendo se tenga la logica del los roles asignados que podran acceder a esta ruta
//  que seria el CEE  de estudiantes 
//   .use(authenticateJwt)
//   .use(isAdmin);

router
  .post("/", createTransaccion)
  .get("/", getTransacciones)
  .get("/detail/", getTransaccion)
  .delete("/detail/", deleteTransaccion);

export default router; 