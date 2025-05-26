import {
    createPanelNotificacionService,
    deletePanelNotificacionService,
    getAllPanelNotificacionesService,
    getPanelNotificacionesByEstudianteService,
  } from "../services/panelNotificaciones.service.js";
  import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
  
  
  // Obtener todas las notificaciones de panel
  export async function getAllPanelNotificacionesController(req, res) {
    try {
      const notificaciones = await getAllPanelNotificacionesService();
      return handleSuccess(res, 200, "Panel de notificaciones obtenido correctamente.", notificaciones);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener el panel de notificaciones.");
    }
  }
  
  // Obtener todas las notificaciones de panel por rutEstudiante
  export async function getPanelNotificacionesByEstudianteController(req, res) {
    try {
      const { rutEstudiante } = req.params;
      const notificaciones = await getPanelNotificacionesByEstudianteService(rutEstudiante);
      return handleSuccess(res, 200, "Panel de notificaciones del estudiante obtenido correctamente.", notificaciones);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener el panel de notificaciones del estudiante.");
    }
  }
  
  // Crear una nueva notificación en el panel
  export async function createPanelNotificacionController(req, res) {
    try {
      const { rutEstudiante, idNotificacion, idActividad } = req.body;
      if (!rutEstudiante || !idNotificacion || !idActividad) {
        return handleErrorClient(res, 400, "Faltan datos requeridos.");
      }
      const nuevaNotificacion = await createPanelNotificacionService({ rutEstudiante, idNotificacion, idActividad });
      return handleSuccess(res, 201, "Notificación de panel creada correctamente.", nuevaNotificacion);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al crear la notificación en el panel.");
    }
  }
  
// Eliminar una notificación del panel solo por rutEstudiante e idNotificacion
export async function deletePanelNotificacionController(req, res) {
    try {
      const { rutEstudiante, idNotificacion } = req.params;
      const notificacion = await deletePanelNotificacionService({ rutEstudiante, idNotificacion });
      if (!notificacion) {
        return handleErrorClient(res, 404, "Notificación de panel no encontrada.");
      }
      return handleSuccess(res, 200, "Notificación de panel eliminada correctamente.", notificacion);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al eliminar la notificación del panel.");
    }
  }
  