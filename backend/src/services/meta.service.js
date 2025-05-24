"use strict";
import { AppDataSource } from "../config/configDb.js";
import MetaFinanciera from "../entity/meta-financiera.entity.js";
import BalanceCEE from "../entity/balance-cee.entity.js";

export async function createMetaService(meta) {
  try {
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    // Obtener el balance actual para calcular el porcentaje inicial
    const balance = await balanceRepository.findOne({
      where: { idBalanceCEE: 1 }
    });

    if (!balance) return [null, "No se encontró el balance"];

    const porcentajeInicial = (balance.totalIngresos / meta.metaFinanciera) * 100;
    meta.porcentajeCrecimiento = Math.min(porcentajeInicial, 100);

    const newMeta = metaRepository.create(meta);
    await metaRepository.save(newMeta);

    return [newMeta, null];
  } catch (error) {
    console.error("Error al crear la meta financiera:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMetasService() {
  try {
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);

    const metas = await metaRepository.find({
      order: { fechaRegistro: "DESC" }
    });

    if (!metas || metas.length === 0) return [null, "No hay metas financieras"];

    return [metas, null];
  } catch (error) {
    console.error("Error al obtener las metas financieras:", error);
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

    // Si se actualiza la meta financiera, recalcular el porcentaje
    if (body.metaFinanciera) {
      const balance = await balanceRepository.findOne({
        where: { idBalanceCEE: 1 }
      });

      if (!balance) return [null, "No se encontró el balance"];

      const nuevoPorcentaje = (balance.totalIngresos / body.metaFinanciera) * 100;
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