import { AppDataSource } from "../config/configDb.js";
import PanelNotificaciones from "../entity/panel-notificaciones.entity.js";

// Obtener todas las notificaciones de panel
export async function getAllPanelNotificacionesService() {
  const repo = AppDataSource.getRepository(PanelNotificaciones);
  return await repo.find({
    relations: ["estudiante", "notificacion", "actividad"],
    order: { idActividad: "DESC" }
  });
}

// Obtener una notificación de panel por rutEstudiante
export async function getPanelNotificacionesByEstudianteService(rutEstudiante) {
    const repo = AppDataSource.getRepository(PanelNotificaciones);
    return await repo.find({
      where: { rutEstudiante },
      relations: ["estudiante", "notificacion", "actividad"]
    });
  }
  

// Crear una nueva notificación en panel
export async function createPanelNotificacionService(data) {
  const repo = AppDataSource.getRepository(PanelNotificaciones);
  const panel = repo.create(data);
  return await repo.save(panel);
}

// Eliminar una notificación del panel solo por rutEstudiante e idNotificacion
export async function deletePanelNotificacionService({ rutEstudiante, idNotificacion }) {
    const repo = AppDataSource.getRepository(PanelNotificaciones);
    const panel = await repo.findOne({ where: { rutEstudiante, idNotificacion } });
    if (panel) {
      await repo.remove(panel);
      return panel;
    }
    return null;
  }
  