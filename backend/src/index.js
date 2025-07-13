"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";

//import passport from "passport";   Ver si borrar o no  .... ahora la descomentaremos
import passport from "passport";


import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { 
  assignSampleRoles,
  createEstadoActividad,
  createEstudiantes,
  createNotificacion,
  createRoles,
  createTipoActividad,
  createTiposTransaccion,
  //createUsers,  comentado ya que borramos todo que ver con auth y users
} from "./config/initialSetup.js";

//import { passportJwtSetup } from "./auth/passport.auth.js";  Ver si borrar o no

// agregamos esta nueva linea para reemplazar lo de arriba
import "./auth/jwtStrategy.auth.js";

// y tmbn Agregamos para exponer el middleware de autenticación
import { authenticateJwt } from "./middlewares/authentication.middleware.js";



async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(
      cors({
        credentials: true,
        origin: true,
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    );

    app.use(
      json({
        limit: "1mb",
      }),
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    );

    //app.use(passport.initialize()); Ver si borrar o no... descomentaremos
    app.use(passport.initialize());
    
    //app.use(passport.session()); Ver si borrar o no

    //passportJwtSetup();

    app.use("/api", indexRoutes);


    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();
    //await createUsers();  comentado ya que borramos todo que ver con auth y users
    await createTipoActividad();
    await createTiposTransaccion();
    await createEstadoActividad();
    await createNotificacion();
    await createRoles();
    await createEstudiantes();
    await assignSampleRoles();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );