import {
    actualizarEstadoActividadService,
    createActividadService,
    deleteActividadService,
    getActividadByIdService,
    getAllActividadesService,
    updateActividadService
  } from "../services/actividad.service.js";

  import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
  import { actividadBodyValidation } from "../validations/actividad.validation.js"; 
  
  // Obtener todas las actividades
  export async function getAllActividadesController(req, res) {
    try {
      const actividades = await getAllActividadesService();
      return handleSuccess(res, 200, "Actividades obtenidas correctamente.", actividades);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener actividades.");
    }
  }
  
  // Obtener actividad por ID
  export async function getActividadByIdController(req, res) {
    try {
      const { id } = req.params;
      const actividad = await getActividadByIdService(id);
      if (!actividad) {
        return handleErrorClient(res, 404, "Actividad no encontrada.");
      }
      return handleSuccess(res, 200, "Actividad obtenida correctamente.", actividad);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener la actividad.");
    }
  }
  
  // Crear nueva actividad
  export async function createActividadController(req, res) {
    try {
      // Validación (usando Joi)
      const { error } = actividadBodyValidation.validate(req.body, { abortEarly: false });
      if (error) {
        return handleErrorClient(res, 400, "Error de validación", error.details.map(e => e.message));
      }
      const actividad = await createActividadService(req.body);
      return handleSuccess(res, 201, "Actividad creada correctamente.", actividad);
    } catch (error) {
        console.error("Error real al crear actividad:", error);
        return handleErrorServer(res, 500, "Error al crear actividad.");
    }      
  }
  
  // Actualizar actividad
  export async function updateActividadController(req, res) {
    try {
      const { id } = req.params;
      // Validación (usando Joi)
      const { error } = actividadBodyValidation.validate(req.body, { abortEarly: false });
      if (error) {
        return handleErrorClient(res, 400, "Error de validación", error.details.map(e => e.message));
      }
      const actividad = await updateActividadService(id, req.body);
      if (!actividad) {
        return handleErrorClient(res, 404, "Actividad no encontrada.");
      }
      return handleSuccess(res, 200, "Actividad actualizada correctamente.", actividad);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al actualizar actividad.");
    }
  }
  
  // Eliminar actividad
  export async function deleteActividadController(req, res) {
    try {
      const { id } = req.params;
      const actividad = await deleteActividadService(id);
      if (!actividad) {
        return handleErrorClient(res, 404, "Actividad no encontrada.");
      }
      return handleSuccess(res, 200, "Actividad eliminada correctamente.", actividad);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al eliminar actividad.");
    }
  }
  

// Actualizar SOLO el estado de la actividad
export async function actualizarEstadoActividadController(req, res) {
    try {
      const { id } = req.params;
      const { idEstadoActividad } = req.body;
  
      if (!idEstadoActividad) {
        return handleErrorClient(res, 400, "El nuevo estado es requerido.");
      }
  
      const actividad = await actualizarEstadoActividadService(id, idEstadoActividad);
  
      return handleSuccess(res, 200, "Estado de la actividad actualizado correctamente.", actividad);
    } catch (error) {
      // Maneja los distintos tipos de error
      if (error.message.includes("no encontrada")) {
        return handleErrorClient(res, 404, error.message);
      }
      if (error.message.includes("No se puede archivar")) {
        return handleErrorClient(res, 400, error.message);
      }
      return handleErrorServer(res, 500, "Error al actualizar el estado de la actividad.");
    }
  }