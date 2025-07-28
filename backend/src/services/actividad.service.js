
import { AppDataSource } from "../config/configDb.js";
import Actividad from "../entity/actividad.entity.js";
import PanelNotificaciones from "../entity/panel-notificaciones.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import { getEstadoActividadByIdService } from "./estado-actividad.service.js";

// Obtener todas las actividades (incluye relaciones)
export async function getAllActividadesService() {
  const repo = AppDataSource.getRepository(Actividad); 
  return await repo.find({
    relations: ["estadoActividad", "tipoActividad", "asistencias", "tokens"],
    order: { idActividad: "DESC" }
  });
}

// Obtener actividad por ID (incluye relaciones)
export async function getActividadByIdService(id) {
  const repo = AppDataSource.getRepository(Actividad);
  return await repo.findOne({
    where: { idActividad: id },
    relations: ["estadoActividad", "tipoActividad", "asistencias", "tokens"]
  });
}

// Crear nueva actividad y poblar panel_notificaciones
export async function createActividadService(data) {
    const actividadRepo = AppDataSource.getRepository(Actividad);
    const estudianteRepo = AppDataSource.getRepository(Estudiante);
    const panelRepo = AppDataSource.getRepository(PanelNotificaciones);
  
    // 1. Crear la actividad normalmente
    const actividad = actividadRepo.create({
      ...data,
      estadoActividad: data.idEstadoActividad ? { idEstadoActividad: data.idEstadoActividad } : undefined,
      tipoActividad: data.idTipoActividad ? { idTipoActividad: data.idTipoActividad } : undefined,
    });
    const nuevaActividad = await actividadRepo.save(actividad);
  
    // 2. Buscar todos los estudiantes activos (opcional: puedes poner filtro si solo quieres algunos)
    const estudiantes = await estudianteRepo.find();
  
    // 3. Crear registros en panel_notificaciones para cada estudiante
    const panelEntries = estudiantes.map(estudiante => ({
      rutEstudiante: estudiante.rutEstudiante,
      idNotificacion: 1,
      idActividad: nuevaActividad.idActividad,
    }));
  
    await panelRepo.save(panelEntries);
  
    return nuevaActividad;
  }

  // Actualizar  actividad
  export async function updateActividadService(id, data) {
    const actividadRepo  = AppDataSource.getRepository(Actividad);
    const estudianteRepo  = AppDataSource.getRepository(Estudiante);
    const panelRepo       = AppDataSource.getRepository(PanelNotificaciones);
  
    // 1) Actualizar la actividad
    await actividadRepo.update(
      { idActividad: id },
      {
        ...data,
        estadoActividad: data.idEstadoActividad
          ? { idEstadoActividad: data.idEstadoActividad }
          : undefined,
        tipoActividad: data.idTipoActividad
          ? { idTipoActividad: data.idTipoActividad }
          : undefined,
      }
    );
  
    // 2) Poblar panel_notificaciones con notificación = 2 para cada estudiante
    const estudiantes = await estudianteRepo.find();
    const panelEntries = estudiantes.map(estudiante => ({
      rutEstudiante:    estudiante.rutEstudiante,
      idNotificacion:   2,
      idActividad:      id,
    }));
    await panelRepo.save(panelEntries);
  
    // 3) Devolver la actividad actualizada con relaciones
    return actividadRepo.findOne({
      where: { idActividad: id },
      relations: ["estadoActividad", "tipoActividad", "asistencias", "tokens"]
    });
  }

// Eliminar actividad
export async function deleteActividadService(id) {
  const repo = AppDataSource.getRepository(Actividad);
  const actividad = await repo.findOne({ where: { idActividad: id } });
  if (actividad) {
    await repo.remove(actividad);
    return actividad;
  }
  return null;
}

export async function actualizarEstadoActividadService(idActividad, nuevoIdEstadoActividad) {
  const repo       = AppDataSource.getRepository(Actividad);
  const panelRepo  = AppDataSource.getRepository(PanelNotificaciones);
  const estudianteRepo = AppDataSource.getRepository(Estudiante);

  // 1) Busca la actividad con su estado actual
  const actividad = await repo.findOne({
    where: { idActividad },
    relations: ["estadoActividad"],
  });
  if (!actividad) throw new Error("Actividad no encontrada");

  // 2) Obtiene la descripción del estado actual y del nuevo
  const estadoActual = await getEstadoActividadByIdService(actividad.estadoActividad.idEstadoActividad);
  if (!estadoActual) throw new Error("Estado actual de actividad no encontrado");

  const estadoNuevo = await getEstadoActividadByIdService(nuevoIdEstadoActividad);
  if (!estadoNuevo) throw new Error("Estado nuevo de actividad no encontrado");

  // 3) Validación: no archivar si está en proceso
  if (
    estadoActual.descripcionEstadoActividad.trim().toLowerCase() === "en proceso" &&
    estadoNuevo.descripcionEstadoActividad.trim().toLowerCase() === "archivada"
  ) {
    throw new Error("No se puede archivar una actividad que está en proceso.");
  }

  // 4) Actualiza el estado
  actividad.estadoActividad = estadoNuevo;
  await repo.save(actividad);

  // 5) Si pasó a 'Archivada', crea notificaciones (idNotificacion = 3) para todos los estudiantes
  if (estadoNuevo.descripcionEstadoActividad.trim().toLowerCase() === "archivada") {
    const estudiantes = await estudianteRepo.find();
    const panelEntries = estudiantes.map(est => ({
      rutEstudiante:  est.rutEstudiante,
      idNotificacion: 3,
      idActividad:    actividad.idActividad,
    }));
    await panelRepo.save(panelEntries);
  }

  // 6) Devuelve la actividad actualizada con sus relaciones
  return repo.findOne({
    where: { idActividad },
    relations: ["estadoActividad", "tipoActividad", "asistencias", "tokens"]
  });
}