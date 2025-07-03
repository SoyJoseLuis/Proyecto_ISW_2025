/*import passport from "passport";

export const authenticateJwt = passport.authenticate("jwt", { session: false });
*/



"use strict";

// Importar passport ya configurado: al hacerlo, ejecuta passport.use(...)
import passport from "../auth/jwtStrategy.auth.js";

// Exportar un wrapper cortito para usar en tus rutas
export const authenticateJwt = passport.authenticate("jwt", {
  session: false,
});
