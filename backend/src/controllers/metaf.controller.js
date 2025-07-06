"use strict";
import {
  createMetaService,
  deleteMetaService,
  getAllMetasService,
  getMetasByYearService,
  getMetaService,
  updateMetaService,
} from "../services/metaf.service.js";
import {
  metaBodyValidation,
  metaQueryValidation,
} from "../validations/metaf.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createMeta(req, res) {
  try {
    const { body } = req;

    const { error } = metaBodyValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [newMeta, errorMeta] = await createMetaService(body);

    if (errorMeta) return handleErrorClient(res, 400, "Error creando la meta financiera", errorMeta);

    handleSuccess(res, 201, "Meta financiera creada con éxito", newMeta);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMeta(req, res) {
  try {
    const { id } = req.query;

    const { error } = metaQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [meta, errorMeta] = await getMetaService({ id });

    if (errorMeta) return handleErrorClient(res, 404, errorMeta);

    handleSuccess(res, 200, "Meta financiera encontrada", meta);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllMetas(req, res) {
  try {
    const [metas, errorMetas] = await getAllMetasService();

    if (errorMetas) return handleErrorClient(res, 404, "Error obteniendo las metas financieras", errorMetas);

    handleSuccess(res, 200, "Metas financieras obtenidas con éxito", metas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMetasByYear(req, res) {
  try {
    const { year } = req.query;

    if (!year) {
      return handleErrorClient(res, 400, "El año es requerido");
    }

    const [metas, errorMetas] = await getMetasByYearService(year);

    if (errorMetas) return handleErrorClient(res, 404, "Error obteniendo las metas financieras por año", errorMetas);

    handleSuccess(res, 200, `Metas financieras del año ${year} obtenidas con éxito`, metas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateMeta(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;

    const { error: queryError } = metaQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = metaBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [meta, metaError] = await updateMetaService({ id }, body);

    if (metaError) return handleErrorClient(res, 400, "Error modificando la meta financiera", metaError);

    handleSuccess(res, 200, "Meta financiera modificada correctamente", meta);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteMeta(req, res) {
  try {
    const { id } = req.query;

    const { error: queryError } = metaQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [metaDelete, errorMetaDelete] = await deleteMetaService({ id });

    if (errorMetaDelete) return handleErrorClient(res, 404, "Error eliminando la meta financiera", errorMetaDelete);

    handleSuccess(res, 200, "Meta financiera eliminada correctamente", metaDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
} 