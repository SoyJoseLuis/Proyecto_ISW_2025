const BASE_URL = import.meta.env.VITE_API_URL || "http://146.83.198.35:1293/api";

export async function crearActividad(data) {
    const API_URL = `${BASE_URL}/actividades/`;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear actividad");
    }
  
    return await response.json();
  }

  export async function getActividades() {
    const API_URL = `${BASE_URL}/actividades/`;
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener actividades");
    const json = await response.json();
    return json.data;
  }

  export async function actualizarEstadoActividad(idActividad, idEstadoActividad) {
    const API_URL = `${BASE_URL}/actividades/${idActividad}/estado`;
    const response = await fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idEstadoActividad })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar estado");
    }
    return await response.json();
  }
  

  export async function actualizarActividad(idActividad, data) {
    const response = await fetch(`${BASE_URL}/actividades/${idActividad}`, {
      method: "PUT", // o PATCH según tu API
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar actividad");
    }
    return await response.json();
  }