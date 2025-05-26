"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import transaccionRoutes from "./transaccion.routes.js";
import metaRoutes from "./metaf.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/transaccion", transaccionRoutes)
    .use("/metaf", metaRoutes);

export default router;