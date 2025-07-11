import axios from "axios";

// Devuelve todas las actividades
export async function listActividades() {

  const response = await axios.get("http://localhost:4000/api/actividades"); //Nos devolverá la data larga de actividades status, message, data...

  // Si ahcemos solo response.data traeremos la data larga, pero si hacemos response.data.data traemos solo el array de actividades
  return response.data.data;
}
