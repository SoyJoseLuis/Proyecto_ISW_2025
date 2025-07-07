"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createMeta,
  deleteMeta,
  getAllMetas,
  getMeta,
  getMetasByYear,
  updateMeta
} from "../controllers/metaf.controller.js";

const router = Router();

router
  .post("/", createMeta)/*analizar el tema de cuando poder crear una meta financiera */ 
  .get("/", getAllMetas)
  .get("/by-year/", getMetasByYear)
  .get("/detail/", getMeta)/**/
  .patch("/detail/", updateMeta)/* un presidente si puede ??actulizar la meta anual si se tiene  FE*/
  .delete("/detail/", deleteMeta)
export default router; 


