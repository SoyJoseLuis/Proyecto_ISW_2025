"use strict";
import { AppDataSource } from "../config/configDb.js";
import BalanceCEE from "../entity/balance-cee.entity.js";

export async function getBalanceService() {
  try {
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const balance = await balanceRepository.findOne({
      where: { idBalanceCEE: 1 }
    });

    if (!balance) return [null, "No se encontró el balance"];

    return [balance, null];
  } catch (error) {
    console.error("Error al obtener el balance:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateBalanceService(body) {
  try {
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const balance = await balanceRepository.findOne({
      where: { idBalanceCEE: 1 }
    });

    if (!balance) return [null, "No se encontró el balance"];

    Object.assign(balance, body);
    await balanceRepository.save(balance);

    return [balance, null];
  } catch (error) {
    console.error("Error al actualizar el balance:", error);
    return [null, "Error interno del servidor"];
  }
} 