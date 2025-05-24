"use strict";
import { AppDataSource } from "../config/configDb.js";
import Transaccion from "../entity/transaccion.entity.js";
import BalanceCEE from "../entity/balance-cee.entity.js";
import MetaFinanciera from "../entity/meta-financiera.entity.js";

export async function createTransaccionService(transaccion) {
  try {
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);

    // Obtener el balance actual
    const balance = await balanceRepository.findOne({
      where: { idBalanceCEE: 1 }
    });

    if (!balance) return [null, "No se encontró el balance"];

    // Calcular el nuevo monto según el tipo de transacción
    let nuevoMonto;
    if (transaccion.idTipoTransaccion === 1) { // Ingreso
      nuevoMonto = balance.montoActual + transaccion.montoTransaccion;
      balance.totalIngresos += transaccion.montoTransaccion;
    } else { // Salida
      if (balance.montoActual < transaccion.montoTransaccion) {
        return [null, "Fondos insuficientes para realizar la transacción"];
      }
      nuevoMonto = balance.montoActual - transaccion.montoTransaccion;
      balance.totalSalidas += transaccion.montoTransaccion;
    }

    // Actualizar el balance
    balance.montoActual = nuevoMonto;
    await balanceRepository.save(balance);

    // Crear la transacción
    const newTransaccion = transaccionRepository.create(transaccion);
    await transaccionRepository.save(newTransaccion);

    // Actualizar meta financiera si es un ingreso
    if (transaccion.idTipoTransaccion === 1) {
      const meta = await metaRepository.findOne({
        order: { idMetaFinanciera: "DESC" }
      });

      if (meta) {
        const porcentajeActual = (balance.totalIngresos / meta.metaFinanciera) * 100;
        meta.porcentajeCrecimiento = Math.min(porcentajeActual, 100);
        await metaRepository.save(meta);
      }
    }

    return [newTransaccion, null];
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTransaccionesService() {
  try {
    const transaccionRepository = AppDataSource.getRepository(Transaccion);

    const transacciones = await transaccionRepository.find({
      relations: ["estudiante", "tipoTransaccion", "actividad"]
    });

    if (!transacciones || transacciones.length === 0) return [null, "No hay transacciones"];

    return [transacciones, null];
  } catch (error) {
    console.error("Error al obtener las transacciones:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTransaccionService(query) {
  try {
    const { id } = query;
    const transaccionRepository = AppDataSource.getRepository(Transaccion);

    const transaccion = await transaccionRepository.findOne({
      where: { idTransaccion: id },
      relations: ["estudiante", "tipoTransaccion", "actividad"]
    });

    if (!transaccion) return [null, "Transacción no encontrada"];

    return [transaccion, null];
  } catch (error) {
    console.error("Error al obtener la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateTransaccionService(query, body) {
  try {
    const { id } = query;
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const transaccion = await transaccionRepository.findOne({
      where: { idTransaccion: id }
    });

    if (!transaccion) return [null, "Transacción no encontrada"];

    // Obtener el balance actual
    const balance = await balanceRepository.findOne({
      where: { idBalanceCEE: 1 }
    });

    if (!balance) return [null, "No se encontró el balance"];

    // Revertir la transacción anterior
    if (transaccion.idTipoTransaccion === 1) {
      balance.montoActual -= transaccion.montoTransaccion;
      balance.totalIngresos -= transaccion.montoTransaccion;
    } else {
      balance.montoActual += transaccion.montoTransaccion;
      balance.totalSalidas -= transaccion.montoTransaccion;
    }

    // Aplicar la nueva transacción
    if (body.idTipoTransaccion === 1) {
      balance.montoActual += body.montoTransaccion;
      balance.totalIngresos += body.montoTransaccion;
    } else {
      if (balance.montoActual < body.montoTransaccion) {
        return [null, "Fondos insuficientes para realizar la transacción"];
      }
      balance.montoActual -= body.montoTransaccion;
      balance.totalSalidas += body.montoTransaccion;
    }

    await balanceRepository.save(balance);
    
    // Actualizar la transacción
    Object.assign(transaccion, body);
    await transaccionRepository.save(transaccion);

    return [transaccion, null];
  } catch (error) {
    console.error("Error al actualizar la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteTransaccionService(query) {
  try {
    const { id } = query;
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const transaccion = await transaccionRepository.findOne({
      where: { idTransaccion: id }
    });

    if (!transaccion) return [null, "Transacción no encontrada"];

    // Obtener el balance actual
    const balance = await balanceRepository.findOne({
      where: { idBalanceCEE: 1 }
    });

    if (!balance) return [null, "No se encontró el balance"];

    // Revertir la transacción
    if (transaccion.idTipoTransaccion === 1) {
      balance.montoActual -= transaccion.montoTransaccion;
      balance.totalIngresos -= transaccion.montoTransaccion;
    } else {
      balance.montoActual += transaccion.montoTransaccion;
      balance.totalSalidas -= transaccion.montoTransaccion;
    }

    await balanceRepository.save(balance);

    // Eliminar la transacción
    await transaccionRepository.remove(transaccion);

    return [transaccion, null];
  } catch (error) {
    console.error("Error al eliminar la transacción:", error);
    return [null, "Error interno del servidor"];
  }
} 