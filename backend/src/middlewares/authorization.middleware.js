// src/middlewares/authorization.middleware.js

/**
 * authorize(...allowedRoles)
 * Permite el acceso si **alguno** de los roles del usuario
 * aparece en la lista de `allowedRoles`.
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // 1) Debe estar autenticado
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // 2) Extrae el array de strings
    const { roles } = req.user;         // ej. ["Presidente","Secretario"]
    if (!Array.isArray(roles) || !roles.some(r => allowedRoles.includes(r))) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }

    // 3) Pasa al controlador
    next();
  };
}
