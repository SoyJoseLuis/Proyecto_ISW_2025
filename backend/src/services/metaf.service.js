"use strict";
import { AppDataSource } from "../config/configDb.js";
import MetaFinanciera from "../entity/meta-financiera.entity.js";
import BalanceCEE from "../entity/balance-cee.entity.js";

export async function createMetaService(meta) {
  try {
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    // Asignar periodo actual si no se proporciona
    if (!meta.periodo) {
      meta.periodo = new Date().getFullYear().toString();
    }

    // Obtener el balance del periodo correspondiente
    const balance = await balanceRepository.findOne({
      where: { periodo: meta.periodo }
    });

    if (!balance) return [null, "No se encontró el balance para el periodo especificado"];

    const porcentajeInicial = (balance.totalIngresos / meta.metaFinanciera) * 100;
    meta.porcentajeCrecimiento = Math.min(Math.round(porcentajeInicial), 100);

    const newMeta = metaRepository.create(meta);
    await metaRepository.save(newMeta);

    return [newMeta, null];
  } catch (error) {
    console.error("Error al crear la meta financiera:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function getMetaService(query) {
  try {
    const { id } = query;
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);

    const meta = await metaRepository.findOne({
      where: { idMetaFinanciera: id }
    });

    if (!meta) return [null, "Meta financiera no encontrada"];

    return [meta, null];
  } catch (error) {
    console.error("Error al obtener la meta financiera:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateMetaService(query, body) {
  try {
    const { id } = query;
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const meta = await metaRepository.findOne({
      where: { idMetaFinanciera: id }
    });

    if (!meta) return [null, "Meta financiera no encontrada"];

    // Si se actualiza la meta financiera o el periodo, recalcular el porcentaje
    if (body.metaFinanciera || body.periodo) {
      const periodoABuscar = body.periodo || meta.periodo;
      const balance = await balanceRepository.findOne({
        where: { periodo: periodoABuscar }
      });

      if (!balance) return [null, "No se encontró el balance para el periodo especificado"];

      const metaFinancieraActualizada = body.metaFinanciera || meta.metaFinanciera;
      const nuevoPorcentaje = (balance.totalIngresos / metaFinancieraActualizada) * 100;
      body.porcentajeCrecimiento = Math.min(nuevoPorcentaje, 100);
    }

    Object.assign(meta, body);
    await metaRepository.save(meta);

    return [meta, null];
  } catch (error) {
    console.error("Error al actualizar la meta financiera:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteMetaService(query) {
  try {
    const { id } = query;
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);

    const meta = await metaRepository.findOne({
      where: { idMetaFinanciera: id }
    });

    if (!meta) return [null, "Meta financiera no encontrada"];

    await metaRepository.remove(meta);

    return [meta, null];
  } catch (error) {
    console.error("Error al eliminar la meta financiera:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function actualizarPorcentajeCrecimiento() {
  try {
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    // Obtener todas las metas y balances
    const metas = await metaRepository.find();
    const balances = await balanceRepository.find();

    // Crear un mapa de balances por periodo para acceso rápido
    const balancesPorPeriodo = balances.reduce((acc, balance) => {
      acc[balance.periodo] = balance;
      return acc;
    }, {});

    // Actualizar todas las metas en una sola transacción
    await AppDataSource.transaction(async transactionalEntityManager => {
      const actualizaciones = metas.map(meta => {
        const balanceCorrespondiente = balancesPorPeriodo[meta.periodo];
        if (!balanceCorrespondiente) {
          throw new Error(`No existe balance para el periodo ${meta.periodo}`);
        }
        
        const nuevoPorcentaje = (balanceCorrespondiente.totalIngresos / meta.metaFinanciera) * 100;
        meta.porcentajeCrecimiento = Math.min(nuevoPorcentaje, 100);
        return meta;
      });
      
      await transactionalEntityManager.save(MetaFinanciera, actualizaciones);
    });

    return [true, null];
  } catch (error) {
    console.error("Error al actualizar porcentajes de crecimiento:", error);
    return [null, `Error interno del servidor: ${error.message}`];
  }
} 