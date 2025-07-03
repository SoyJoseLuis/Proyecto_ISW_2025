"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  getAllBalances,
  getBalanceById,
  getBalanceByPeriod,
  getCurrentBalance,
} from "../controllers/balance.controller.js";
 
const router = Router();


router
  .get("/", getAllBalances)
  .get("/actual", getCurrentBalance)
  .get("/detail/", getBalanceById)
  .get("/periodo/", getBalanceByPeriod);
  

export default router; 