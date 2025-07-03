"use strict";

import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { AppDataSource }                    from "../config/configDb.js";
import Estudiante                          from "../entity/estudiante.entity.js";
import { JWT_SECRET }             from "../config/configEnv.js";

// Opciones de la estrategia: de dónde saco el token y con qué clave lo verifico
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:    JWT_SECRET,
};

// Registrar la estrategia "jwt" en Passport
passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const repo       = AppDataSource.getRepository(Estudiante);
      const estudiante = await repo.findOneBy({ rutEstudiante: payload.rutEstudiante });
      if (estudiante) return done(null, estudiante);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// No exportamos nada más; al importar este archivo, la estrategia ya queda registrada en passport.
export default passport;
