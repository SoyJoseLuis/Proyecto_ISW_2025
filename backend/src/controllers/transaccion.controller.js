"use strict";
import {
  createTransaccionService,
  deleteTransaccionService,
  getTransaccionesService,
  getTransaccionService,
} from "../services/transaccion.service.js";
import {
  transaccionBodyValidation,
  transaccionQueryValidation,
} from "../validations/transaccion.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createTransaccion(req, res) {
  try {
    const { body } = req;

    const { error } = transaccionBodyValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [newTransaccion, errorTransaccion] = await createTransaccionService(body);

    if (errorTransaccion) return handleErrorClient(res, 400, "Error creando la transacción", errorTransaccion);

    handleSuccess(res, 201, "Transacción creada con éxito", newTransaccion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
/*obtiene todas la transacciones sin necesidad de parametros  */ 
export async function getTransacciones(req, res) {
  try {
    const [transacciones, errorTransacciones] = await getTransaccionesService();

    if (errorTransacciones) return handleErrorClient(res, 404, errorTransacciones);

    transacciones.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Transacciones encontradas", transacciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getTransaccion(req, res) {
  try {
    const { id } = req.query;

    const { error } = transaccionQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [transaccion, errorTransaccion] = await getTransaccionService({ id });

    if (errorTransaccion) return handleErrorClient(res, 404, errorTransaccion);

    handleSuccess(res, 200, "Transacción encontrada", transaccion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}



export async function deleteTransaccion(req, res) {
  try {
    const { id } = req.query;

    const { error: queryError } = transaccionQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [transaccionDelete, errorTransaccionDelete] = await deleteTransaccionService({ id });

    if (errorTransaccionDelete) return handleErrorClient(res, 404, "Error -d la transacción", errorTransaccionDelete);

    handleSuccess(res, 200, "Transacción eliminada correctamente", transaccionDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
} 