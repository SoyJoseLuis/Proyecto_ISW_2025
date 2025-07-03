import { loginStudent } from "../services/estudiente.service.js";
import { studentLoginValidation } from "../validations/estudiente.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess
} from "../handlers/responseHandlers.js";

export const login = async (req, res) => {
  try {
    const { error } = studentLoginValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.details);
    }

    const { correoEstudiante, passEstudiante } = req.body;
    const response = await loginStudent(correoEstudiante, passEstudiante);

    if (response.error) {
      return handleErrorClient(res, 401, response.message);
    }

    return handleSuccess(res, response.statusCode, response.message, response.data);
  } catch (error) {
    return handleErrorServer(res, 500, "Error en el servidor");
  }
};
