"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  getAllBalances,
  getBalanceById,
  getBalanceByPeriod,
  getCurrentBalance,
} from "../controllers/balance.controller.js";

const router = Router();

router
  .use(authenticateJwt)

router
  .get("/", getAllBalances)
  .get("/actual", getCurrentBalance)
  .get("/detail/", getBalanceById)
  .get("/periodo/", getBalanceByPeriod);

export default router; 