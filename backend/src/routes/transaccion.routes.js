"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createTransaccion,
  getTransacciones,
  getTransaccion,
  updateTransaccion,
  deleteTransaccion
} from "../controllers/transaccion.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .post("/", createTransaccion)
  .get("/", getTransacciones)
  .get("/detail/", getTransaccion)
  .patch("/detail/", updateTransaccion)
  .delete("/detail/", deleteTransaccion);

export default router; 