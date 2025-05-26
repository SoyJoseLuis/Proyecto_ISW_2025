import {
    getAllTiposActividadService,
    getTipoActividadByIdService,
  } from "../services/tipo-actividad.service.js";
  import { handleErrorClient, handleErrorServer , handleSuccess } from "../handlers/responseHandlers.js";
  
  // Obtener todos los tipos de actividad
  export async function getAllTiposActividadController(req, res) {
    try {
      const tipos = await getAllTiposActividadService();
      return handleSuccess(res, 200, "Tipos de actividad obtenidos correctamente.", tipos);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener los tipos de actividad.");
    }
  }
  
  // Obtener tipo de actividad por ID
  export async function getTipoActividadByIdController(req, res) {
    try {
      const { id } = req.params;
      const tipo = await getTipoActividadByIdService(id);
      if (!tipo) {
        return handleErrorClient(res, 404, "Tipo de actividad no encontrado.");
      }
      return handleSuccess(res, 200, "Tipo de actividad obtenido correctamente.", tipo);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener el tipo de actividad.");
    }
  }
  