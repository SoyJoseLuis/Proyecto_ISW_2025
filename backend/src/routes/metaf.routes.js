"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorize } from "../middlewares/authorization.middleware.js";
import {
  createMeta,
  deleteMeta,
  getAllMetas,
  getMeta,
  getMetasByYear,
  updateMeta
} from "../controllers/metaf.controller.js";

const router = Router();



router.use(authenticateJwt);


// Middleware de autorización
router.use(authorize("Presidente", "Tesorero"));

router
  .post("/", createMeta)
  .get("/", getAllMetas)
  .get("/by-year/", getMetasByYear)
  .get("/detail/", getMeta)
  .patch("/detail/", updateMeta)
  .delete("/detail/", deleteMeta);

export default router; 


