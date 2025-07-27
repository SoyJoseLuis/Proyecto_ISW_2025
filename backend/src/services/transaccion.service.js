"use strict";
import { AppDataSource } from "../config/configDb.js";
import Transaccion from "../entity/transaccion.entity.js";
import BalanceCEE from "../entity/balance-cee.entity.js";


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
    const tipoTransaccion = parseInt(transaccion.idTipoTransaccion);
    if (tipoTransaccion === 1) { // Ingreso
      nuevoMonto = balance.montoActual + transaccion.montoTransaccion;
      balance.totalIngresos += transaccion.montoTransaccion;

      // ACTUALIZAR ingresoFullBalance SOLO EN INGRESOS
      if (balance.ingresoFullBalance == null) {
        balance.ingresoFullBalance = 0;
      }
      balance.ingresoFullBalance += transaccion.montoTransaccion;
    } else { // Salida
      if (balance.montoActual < transaccion.montoTransaccion) {
        return [null, "Fondos insuficientes para realizar la transacción"];
      }
      nuevoMonto = balance.montoActual - transaccion.montoTransaccion;
      balance.totalSalidas += transaccion.montoTransaccion;
      // NO SE MODIFICA ingresoFullBalance
    }

    // Actualizar el balance
    balance.montoActual = nuevoMonto;
    await balanceRepository.save(balance);


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
      where: { activo: true }, // Solo obtener transacciones activas
      relations: ["estudiante", "tipoTransaccion"]
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
      where: { 
        idTransaccion: id,
        activo: true // Solo obtener si está activa
      },
      relations: ["estudiante", "tipoTransaccion"]
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
    console.log("Intentando eliminar transacción con ID:", id);
    
    const transaccionRepository = AppDataSource.getRepository(Transaccion);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    // Obtener la transacción activa con su balance
    const transaccion = await transaccionRepository.findOne({
      where: { 
        idTransaccion: id,
        activo: true // Solo si está activa
      },
      relations: ["balance"]
    });

    console.log("Transacción encontrada:", transaccion ? "Sí" : "No");
    if (transaccion) {
      console.log("ID Transacción:", transaccion.idTransaccion);
      console.log("Fecha Creación:", transaccion.fechaCreacion);
      console.log("Activo:", transaccion.activo);
    }

    if (!transaccion) return [null, "Transacción no encontrada o ya eliminada"];

    // Validar que la transacción se pueda eliminar (dentro de 5 minutos)
    // PROBLEMA: Las fechas se guardan en zona horaria chilena pero con formato UTC (terminan en 'Z')
    // SOLUCIÓN: Quitar la 'Z' para que se interprete como hora local chilena
    const fechaCreacionString = transaccion.fechaCreacion.toString();
    const fechaSinZ = fechaCreacionString.replace("Z", "");
    const fechaCreacionTimestamp = new Date(fechaSinZ).getTime();
    const ahoraTimestamp = Date.now();
    const diferenciaMinutos = Math.floor((ahoraTimestamp - fechaCreacionTimestamp) / (1000 * 60));
    
    console.log("Fecha creación original:", transaccion.fechaCreacion);
    console.log("Fecha creación sin Z:", fechaSinZ);
    console.log("Fecha creación timestamp:", fechaCreacionTimestamp);
    console.log("Ahora timestamp:", ahoraTimestamp);
    console.log("Diferencia en minutos:", diferenciaMinutos);
    
    if (diferenciaMinutos > 5) {
      return [null, "Solo se pueden eliminar transacciones dentro de los primeros 5 minutos después de su creación"];
    }

    const balance = transaccion.balance;
    if (!balance) return [null, "No se encontró el balance asociado"];

    // Obtener el periodo antes de hacer cambios
    const periodoAfectado = balance.periodo;

  
    // Convertir idTipoTransaccion  4:25AM
    const tipoTransaccion = parseInt(transaccion.idTipoTransaccion);

    // Revertir la transacción del balance
    if (tipoTransaccion === 1) { // Era un ingreso
      balance.montoActual -= transaccion.montoTransaccion;
      balance.totalIngresos -= transaccion.montoTransaccion;
      // También revertir ingresoFullBalance
      if (balance.ingresoFullBalance == null) {
        balance.ingresoFullBalance = 0;
      }
      balance.ingresoFullBalance -= transaccion.montoTransaccion;
    } else if (tipoTransaccion === 2) { // Era una salida
      balance.montoActual += transaccion.montoTransaccion;
      balance.totalSalidas -= transaccion.montoTransaccion;
      // NO modificar ingresoFullBalance
    }

    // Guardar los cambios en el balance
    await balanceRepository.save(balance);

   
    // SOFT DELETE: Marcar como inactiva en lugar de eliminar físicamente
    transaccion.activo = false;
    await transaccionRepository.save(transaccion);

    return [transaccion, null];
  } catch (error) {
    console.error("Error al eliminar la transacción:", error);
    return [null, "Error interno del servidor"];
  }
}

// Función adicional para obtener transacciones eliminadas (opcional)
export async function getTransaccionesEliminadasService() {
  try {
    const transaccionRepository = AppDataSource.getRepository(Transaccion);

    const transacciones = await transaccionRepository.find({
      where: { activo: false }, // Solo transacciones eliminadas
      relations: ["estudiante", "tipoTransaccion"]
    });

    if (!transacciones || transacciones.length === 0) return [null, "No hay transacciones eliminadas"];

    return [transacciones, null];
  } catch (error) {
    console.error("Error al obtener las transacciones eliminadas:", error);
    return [null, "Error interno del servidor"];
  }
}

