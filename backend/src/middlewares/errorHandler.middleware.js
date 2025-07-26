// src/middlewares/errorHandler.middleware.js
"use strict";

/**
 * Atrapa cualquier error que no haya sido respondido en rutas o controladores
 * y envía un JSON uniforme.
 */



export function errorHandler(err, req, res, next) {
  console.error(err);  // lo dejamos en consola para debug
  const status = err.statusCode || 500;
  res.status(status).json({
    status:  status >= 500 ? "Server error" : "Client error",
    message: err.message || "Error interno del servidor"
  });
}
