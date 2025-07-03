"use strict";
import { Router } from "express";
import { getAllRoles, getRolesByRut } from "../controllers/rol.controller.js";

const router = Router();

// Obtener todos los roles disponibles
router.get("/", getAllRoles);

// Obtener roles de un estudiante por RUT
router.get("/estudiante/:rut", getRolesByRut);

export default router; 