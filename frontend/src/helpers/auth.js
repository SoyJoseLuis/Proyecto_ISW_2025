
export function getCurrentJwt() {
  try {
    const stored = localStorage.getItem("userData");
    if (!stored) return null;
    return JSON.parse(stored).token;
  } catch {
    return null;
  }
}