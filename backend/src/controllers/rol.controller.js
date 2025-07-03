"use strict";
import { getAllRolesService, getRolesByRutService } from "../services/rol.service.js";
import { rutValidation } from "../validations/rol.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Obtiene los roles de un estudiante por su RUT
 */
export async function getRolesByRut(req, res) {
  try {
    const { rut } = req.params;

    // Validar el RUT
    const { error } = rutValidation.validate({ rut });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [roles, errorRoles] = await getRolesByRutService(rut);

    if (errorRoles) {
      return handleErrorClient(res, 404, "Error al obtener roles", errorRoles);
    }

    handleSuccess(res, 200, "Roles del estudiante obtenidos exitosamente", roles);
  } catch (error) {
    console.error("Error en getRolesByRut:", error);
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtiene todos los roles disponibles
 */
export async function getAllRoles(req, res) {
  try {
    const [roles, errorRoles] = await getAllRolesService();

    if (errorRoles) {
      return handleErrorClient(res, 500, "Error al obtener roles", errorRoles);
    }

    roles.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Roles obtenidos exitosamente", roles);
  } catch (error) {
    console.error("Error en getAllRoles:", error);
    handleErrorServer(res, 500, error.message);
  }
} 