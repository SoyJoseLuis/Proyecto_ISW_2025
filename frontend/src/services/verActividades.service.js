import axios from "axios";

// Devuelve todas las actividades
export async function listActividades() {

  const response = await axios.get("http://146.83.198.35:1293/api/actividades"); //Nos devolverá la data larga de actividades status, message, data...

  // Si ahcemos solo response.data traeremos la data larga, pero si hacemos response.data.data traemos solo el array de actividades
  localStorage.setItem("token", response.data.data.token);

  return response.data.data;
}
