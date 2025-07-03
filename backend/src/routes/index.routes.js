"use strict";
import { Router } from "express";
//import userRoutes from "./user.routes.js"; comentar por mientras
//import authRoutes from "./auth.routes.js";  comentar por mientras
import transaccionRoutes from "./transaccion.routes.js";


import metaRoutes from "./metaf.routes.js";
import actividadRoutes from "./actividad.routes.js"; 
import panelNotificacionesRoutes from "./panelNotificaciones.routes.js";
import tipoActividadRoutes from "./tipoActividad.routes.js";
import estadoActividadRoutes from "./estadoActividad.routes.js";
import estudianteRoutes from "./estudiante.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";



const router = Router();

router
    //.use("/auth", authRoutes)  comentar por mientras
    //.use("/user", userRoutes)  comentar por mientras
    .use("/estudiantes", estudianteRoutes)
    .use("/transaccion", transaccionRoutes)

    .use("/metaf", metaRoutes)
    .use("/actividades", actividadRoutes)
    .use("/panel-notificaciones", panelNotificacionesRoutes)
    .use("/tipo-actividad", tipoActividadRoutes)
    .use("/estado-actividad", estadoActividadRoutes)
    .use("/asistencia", asistenciaRoutes)

    



export default router;