"use strict";
import {
  getAllBalancesService,
  getBalanceByIdService,
  getBalanceByPeriodService,
  getCurrentBalanceService,
} from "../services/balance.service.js";
import {
  balanceQueryValidation,
} from "../validations/balance.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Obtiene el balance del período actual (más reciente)
 */
export async function getCurrentBalance(req, res) {
  try {
    const [balance, errorBalance] = await getCurrentBalanceService();

    if (errorBalance) return handleErrorClient(res, 404, errorBalance);

    handleSuccess(res, 200, "Balance actual encontrado", balance);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtiene todos los balances registrados
 */
export async function getAllBalances(req, res) {
  try {
    const [balances, errorBalances] = await getAllBalancesService();

    if (errorBalances) return handleErrorClient(res, 404, errorBalances);

    balances.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Balances encontrados", balances);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtiene un balance específico por ID
 */
export async function getBalanceById(req, res) {
  try {
    const { id } = req.query;

    const { error } = balanceQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [balance, errorBalance] = await getBalanceByIdService({ id });

    if (errorBalance) return handleErrorClient(res, 404, errorBalance);

    handleSuccess(res, 200, "Balance encontrado", balance);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtiene balances por período específico
 */
export async function getBalanceByPeriod(req, res) {
  try {
    const { periodo } = req.query;

    const { error } = balanceQueryValidation.validate({ periodo });

    if (error) return handleErrorClient(res, 400, error.message);

    const [balances, errorBalances] = await getBalanceByPeriodService({ periodo });

    if (errorBalances) return handleErrorClient(res, 404, errorBalances);

    balances.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Balances encontrados para el período", balances);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
} 