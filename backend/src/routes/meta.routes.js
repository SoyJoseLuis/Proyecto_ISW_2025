"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createMeta,
  getMetas,
  getMeta,
  updateMeta,
  deleteMeta
} from "../controllers/meta.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .post("/", createMeta)
  .get("/", getMetas)
  .get("/detail/", getMeta)
  .patch("/detail/", updateMeta)
  .delete("/detail/", deleteMeta);

export default router; 