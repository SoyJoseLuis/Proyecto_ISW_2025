"use strict";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorize }       from "../middlewares/authorization.middleware.js";
import { Router } from "express";
//import { isAdmin } from "../middlewares/authorization.middleware.js";

//import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  getAllBalances,
  getBalanceById,
  getBalanceByPeriod,
  getCurrentBalance,
} from "../controllers/balance.controller.js";

const router = Router();
// Aplicar ambos middlewares a nivel de router
router.use(authenticateJwt);
router.use(authorize("Presidente", "Tesorero","Secretario")); // Protege todas las rutas de una vez

router
  .get("/", getAllBalances)
  .get("/actual", getCurrentBalance)
  .get("/detail/", getBalanceById)
  .get("/periodo/", getBalanceByPeriod)
  
export default router;