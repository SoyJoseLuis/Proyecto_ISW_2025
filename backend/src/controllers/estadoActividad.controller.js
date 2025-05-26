import {
    getAllEstadosActividadService,
    getEstadoActividadByIdService,
  } from "../services/estado-actividad.service.js";
  import { handleErrorClient, handleErrorServer,  handleSuccess    } from "../handlers/responseHandlers.js";
  
  // Obtener todos los estados de actividad
  export async function getAllEstadosActividadController(req, res) {
    try {
      const estados = await getAllEstadosActividadService();
      return handleSuccess(res, 200, "Estados de actividad obtenidos correctamente.", estados);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener los estados de actividad.");
    }
  }
  
  // Obtener estado de actividad por ID
  export async function getEstadoActividadByIdController(req, res) {
    try {
      const { id } = req.params;
      const estado = await getEstadoActividadByIdService(id);
      if (!estado) {
        return handleErrorClient(res, 404, "Estado de actividad no encontrado.");
      }
      return handleSuccess(res, 200, "Estado de actividad obtenido correctamente.", estado);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener el estado de actividad.");
    }
  }
  