
/**
 * Devuelve el JWT almacenado en userData.token
 */
export function getCurrentJwt() {
  try {
    const stored = localStorage.getItem("userData");
    if (!stored) return null;
    return JSON.parse(stored).token;
  } catch {
    return null;
  }
}


/**
 * Decodifica un JWT sin librerías externas
 */
export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];      // parte del medio
    const json    = atob(payload);            // Base64 → string JSON
    return JSON.parse(json);                  // parse a objeto
  } catch {
    return null;
  }
}

/**
 * Devuelve un objeto con los campos que incluiste en el payload
 * p.ej. { rutEstudiante: "...", nombre: "...", exp: ... }
 */
export function getUserFromJwt() {
  const token = getCurrentJwt();
  if (!token) return null;
  return decodeJwt(token);
}

/**
 * Lee el objeto completo que guardaste al hacer login.
 */
export function getStoredUserData() {
  try {
    const raw = localStorage.getItem("userData");
    if (!raw) return null;
    return JSON.parse(raw).student || null;
  } catch {
    return null;
  }
}