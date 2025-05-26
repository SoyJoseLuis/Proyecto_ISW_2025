import { AppDataSource } from "../config/configDb.js";
import EstadoActividad from "../entity/estado-actividad.entity.js";

// Obtener todos los estados de actividad
export async function getAllEstadosActividadService() {
  const repo = AppDataSource.getRepository(EstadoActividad);
  return await repo.find({ order: { idEstadoActividad: "ASC" } });
}

// Obtener uno por ID
export async function getEstadoActividadByIdService(id) {
  const repo = AppDataSource.getRepository(EstadoActividad);
  return await repo.findOne({ where: { idEstadoActividad: id } });
}

// Crear estado de actividad
export async function createEstadoActividadService(data) {
  const repo = AppDataSource.getRepository(EstadoActividad);
  const estado = repo.create(data);
  return await repo.save(estado);
}

// Actualizar estado de actividad
export async function updateEstadoActividadService(id, data) {
  const repo = AppDataSource.getRepository(EstadoActividad);
  await repo.update({ idEstadoActividad: id }, data);
  return await repo.findOne({ where: { idEstadoActividad: id } });
}

// Eliminar estado de actividad
export async function deleteEstadoActividadService(id) {
  const repo = AppDataSource.getRepository(EstadoActividad);
  const estado = await repo.findOne({ where: { idEstadoActividad: id } });
  if (estado) {
    await repo.remove(estado);
    return estado;
  }
  return null;
}
