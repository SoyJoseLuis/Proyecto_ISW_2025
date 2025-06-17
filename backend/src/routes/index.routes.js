"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import transaccionRoutes from "./transaccion.routes.js";


import metaRoutes from "./metaf.routes.js";
import actividadRoutes from "./actividad.routes.js"; 
import panelNotificacionesRoutes from "./panelNotificaciones.routes.js";
import tipoActividadRoutes from "./tipoActividad.routes.js";
import estadoActividadRoutes from "./estadoActividad.routes.js";



const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)

    .use("/transaccion", transaccionRoutes)
    .use("/metaf", metaRoutes)

        
    .use("/actividades", actividadRoutes)
    .use("/panel-notificaciones", panelNotificacionesRoutes)
    .use("/tipo-actividad", tipoActividadRoutes)
    .use("/estado-actividad", estadoActividadRoutes);
    


export default router;