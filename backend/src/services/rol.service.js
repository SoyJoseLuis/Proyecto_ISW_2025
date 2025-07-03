"use strict";
import { AppDataSource } from "../config/configDb.js";
import EstudianteSchema from "../entity/estudiante.entity.js";
import RolSchema from "../entity/rol.entity.js";

/**
 * Obtiene los roles de un estudiante por su RUT
 * @param {string} rutEstudiante - RUT del estudiante
 * @returns {Object} Respuesta con roles del estudiante
 */
export async function getRolesByRutService(rutEstudiante) {
  try {
    const estudianteRepository = AppDataSource.getRepository(EstudianteSchema);

    // Buscar el estudiante con sus roles
    const estudiante = await estudianteRepository.findOne({
      where: { rutEstudiante },
      relations: ["roles"]
    });

    if (!estudiante) {
      return [null, "Estudiante no encontrado"];
    }

    // Verificar si el estudiante está activo
    if (estudiante.fechaDesactivacion) {
      return [null, "El estudiante está desactivado"];
    }

    const resultado = {
      rutEstudiante: estudiante.rutEstudiante,
      nombreEstudiante: estudiante.nombreEstudiante,
      correoEstudiante: estudiante.correoEstudiante,
      roles: estudiante.roles || []
    };

    return [resultado, null];
  } catch (error) {
    console.error("Error al obtener roles del estudiante:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtiene todos los roles disponibles
 * @returns {Object} Lista de todos los roles
 */
export async function getAllRolesService() {
  try {
    const rolRepository = AppDataSource.getRepository(RolSchema);
    
    const roles = await rolRepository.find({
      order: { idRol: "ASC" }
    });

    return [roles, null];
  } catch (error) {
    console.error("Error al obtener todos los roles:", error);
    return [null, "Error interno del servidor"];
  }
} 