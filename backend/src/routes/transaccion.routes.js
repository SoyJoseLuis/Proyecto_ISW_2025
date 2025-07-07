"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createTransaccion,
  deleteTransaccion,
  getTransaccion,
  getTransacciones,
  
} from "../controllers/transaccion.controller.js";

// import { authenticateJwt } from "../middlewares/authentication.middleware.js";



const router = Router();

router
  .post("/", createTransaccion, )
  .get("/", getTransacciones, )
  .get("/detail/", getTransaccion, )
  .delete("/detail/", deleteTransaccion, );

export default router; 