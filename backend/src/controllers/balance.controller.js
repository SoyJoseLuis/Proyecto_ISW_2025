"use strict";
import {
  getBalanceService,
  updateBalanceService,
} from "../services/balance.service.js";
import {
  balanceBodyValidation,
} from "../validations/balance.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getBalance(req, res) {
  try {
    const [balance, errorBalance] = await getBalanceService();

    if (errorBalance) return handleErrorClient(res, 404, errorBalance);

    handleSuccess(res, 200, "Balance encontrado", balance);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateBalance(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = balanceBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [balance, balanceError] = await updateBalanceService(body);

    if (balanceError) return handleErrorClient(res, 400, "Error modificando el balance", balanceError);

    handleSuccess(res, 200, "Balance modificado correctamente", balance);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
} 