"use strict";
import { AppDataSource } from "../config/configDb.js";
import Transaccion from "../entity/transaccion.entity.js";
import BalanceCEE from "../entity/balance-cee.entity.js";
import { actualizarPorcentajeCrecimiento } from "./metaf.service.js";

export async function createTransaccionService(transaccion) {
  try {
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    // Extraer el año de la fecha de transacción (formato DD-MM-YYYY)
    const añoTransaccion = transaccion.fechaTransaccion.split("-")[2];

    // Buscar balance existente para el año de la transacción
    let balance = await balanceRepository.findOne({
      where: { periodo: añoTransaccion }
    });

    // Si no existe balance para ese año, crear uno nuevo
    if (!balance) {
      balance = balanceRepository.create({
        periodo: añoTransaccion,
        montoActual: 0,
        totalIngresos: 0,
        totalSalidas: 0
      });
      await balanceRepository.save(balance);
    }

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

    // Actualizar porcentajes de crecimiento
    const [success, errorPorcentaje] = await actualizarPorcentajeCrecimiento();
    if (errorPorcentaje) {
      console.error("Error al actualizar porcentajes:", errorPorcentaje);
    }

    // Asignar balance a la transacción
    transaccion.balance = balance;

    // Crear la transacción
    const newTransaccion = transaccionRepository.create(transaccion);
    await transaccionRepository.save(newTransaccion);

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



export async function deleteTransaccionService(query) {
  try {
    const { id } = query;
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    // Obtener la transacción con su balance
    const transaccion = await transaccionRepository.findOne({
      where: { idTransaccion: id },
      relations: ["balance"]
    });

    if (!transaccion) return [null, "Transacción no encontrada"];

    const balance = transaccion.balance;
    if (!balance) return [null, "No se encontró el balance asociado"];

    // Revertir la transacción del balance
    if (transaccion.idTipoTransaccion === 1) {
      balance.montoActual -= transaccion.montoTransaccion;
      balance.totalIngresos -= transaccion.montoTransaccion;
    } else {
      balance.montoActual += transaccion.montoTransaccion;
      balance.totalSalidas -= transaccion.montoTransaccion;
    }

    // Guardar los cambios en el balance usando el repositorio
    await balanceRepository.save(balance);

    // Actualizar porcentajes de crecimiento
    const [success, errorPorcentaje] = await actualizarPorcentajeCrecimiento();
    if (errorPorcentaje) {
      console.error("Error al actualizar porcentajes:", errorPorcentaje);
    }

    // Eliminar la transacción
    await transaccionRepository.remove(transaccion);

    return [transaccion, null];
  } catch (error) {
    console.error("Error al eliminar la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}