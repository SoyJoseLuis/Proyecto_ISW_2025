"use strict";
import { AppDataSource } from "../config/configDb.js";
import BalanceCEE from "../entity/balance-cee.entity.js";


export async function getCurrentBalanceService() {
  try {
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const currentBalance = await balanceRepository.findOne({
      order: { periodo: "DESC" }
    });

    if (!currentBalance) {
      return [null, "No se encontró ningún balance registrado"];
    }

    return [currentBalance, null];
  } catch (error) {
    console.error("Error al obtener el balance actual:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getBalanceByPeriodService(query) {
    try {
      const { periodo } = query;
      
      const balanceRepository = AppDataSource.getRepository(BalanceCEE);
  
      const balances = await balanceRepository.find({
        where: { periodo: periodo }
      });
  
      if (!balances || balances.length === 0) {
        return [null, "No se encontraron balances para el período especificado"];
      }
  
      return [balances, null];
    } catch (error) {
      console.error("Error al obtener balances por período:", error);
      return [null, "Error interno del servidor"];
    }
  } 


export async function getAllBalancesService() {
  try {
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const balances = await balanceRepository.find({
      order: { periodo: "DESC" } /*en periodo se ordena de forma descendente */ 
    });

    if (!balances || balances.length === 0) {
      return [null, "No hay balances registrados"];
    }

    return [balances, null];
  } catch (error) {
    console.error("Error al obtener todos los balances:", error);
    return [null, "Error interno del servidor"];
  }
}


/*PROBABLE QUE NO SE OCUPE....pero podria se necesario en el futuro*/ 
export async function getBalanceByIdService(query) {
  try {
    const { id } = query;
    
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const balance = await balanceRepository.findOne({
      where: { idBalanceCEE: id }
    });

    if (!balance) {
      return [null, "Balance no encontrado"];
    }

    return [balance, null];
  } catch (error) {
    console.error("Error al obtener el balance por ID:", error);
    return [null, "Error interno del servidor"];
  }
}

