import { AppDataSource } from "../config/configDb.js";
import TipoActividad from "../entity/tipo-actividad.entity.js";

// Obtener todos los tipos de actividad
export async function getAllTiposActividadService() {
  const repo = AppDataSource.getRepository(TipoActividad);
  return await repo.find({ order: { idTipoActividad: "ASC" } });
}

// Obtener uno por ID
export async function getTipoActividadByIdService(id) {
  const repo = AppDataSource.getRepository(TipoActividad);
  return await repo.findOne({ where: { idTipoActividad: id } });
}

// Crear tipo de actividad
export async function createTipoActividadService(data) {
  const repo = AppDataSource.getRepository(TipoActividad);
  const tipo = repo.create(data);
  return await repo.save(tipo);
}

// Actualizar tipo de actividad
export async function updateTipoActividadService(id, data) {
  const repo = AppDataSource.getRepository(TipoActividad);
  await repo.update({ idTipoActividad: id }, data);
  return await repo.findOne({ where: { idTipoActividad: id } });
}

// Eliminar tipo de actividad
export async function deleteTipoActividadService(id) {
  const repo = AppDataSource.getRepository(TipoActividad);
  const tipo = await repo.findOne({ where: { idTipoActividad: id } });
  if (tipo) {
    await repo.remove(tipo);
    return tipo;
  }
  return null;
}
