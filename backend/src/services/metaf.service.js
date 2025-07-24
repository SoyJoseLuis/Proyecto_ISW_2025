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

    // Asignar el montoFullCrecimiento según el ingresoFullBalance del balance
    if (balance && balance.ingresoFullBalance != null) {
      meta.montoFullCrecimiento = balance.ingresoFullBalance;
    } else {
      meta.montoFullCrecimiento = 0;
    }

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
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const meta = await metaRepository.findOne({
      where: { idMetaFinanciera: id }
    });

    if (!meta) return [null, "Meta financiera no encontrada"];

    // Buscar el balance correspondiente al periodo de la meta
    const balance = await balanceRepository.findOne({
      where: { periodo: meta.periodo }
    });

    // Actualizar el valor de montoFullCrecimiento antes de devolver la meta
    if (balance && balance.ingresoFullBalance != null) {
      meta.montoFullCrecimiento = balance.ingresoFullBalance;
    } else {
      meta.montoFullCrecimiento = 0;
    }

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

    // Buscar el balance correspondiente al periodo actualizado o actual
    const periodoABuscar = body.periodo || meta.periodo;
    const balance = await balanceRepository.findOne({
      where: { periodo: periodoABuscar }
    });

    if (balance && balance.ingresoFullBalance != null) {
      body.montoFullCrecimiento = balance.ingresoFullBalance;
    } else {
      body.montoFullCrecimiento = 0;
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



export async function getAllMetasService() {
  try {
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const metas = await metaRepository.find({
      order: {
        periodo: "DESC",
        idMetaFinanciera: "DESC"
      }
    });

    // Para cada meta, actualizar el montoFullCrecimiento con el ingresoFullBalance del balance correspondiente
    for (const meta of metas) {
      const balance = await balanceRepository.findOne({ where: { periodo: meta.periodo } });
      if (balance && balance.ingresoFullBalance != null) {
        meta.montoFullCrecimiento = balance.ingresoFullBalance;
      } else {
        meta.montoFullCrecimiento = 0;
      }
    }

    return [metas, null];
  } catch (error) {
    console.error("Error al obtener todas las metas financieras:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMetasByYearService(year) {
  try {
    const metaRepository = AppDataSource.getRepository(MetaFinanciera);
    const balanceRepository = AppDataSource.getRepository(BalanceCEE);

    const metas = await metaRepository.find({
      where: { periodo: year.toString() },
      order: {
        idMetaFinanciera: "DESC"
      }
    });

    if (metas.length === 0) {
      return [null, `No se encontraron metas financieras para el año ${year}`];
    }

    // Para cada meta, actualizar el montoFullCrecimiento con el ingresoFullBalance del balance correspondiente
    for (const meta of metas) {
      const balance = await balanceRepository.findOne({ where: { periodo: meta.periodo } });
      if (balance && balance.ingresoFullBalance != null) {
        meta.montoFullCrecimiento = balance.ingresoFullBalance;
      } else {
        meta.montoFullCrecimiento = 0;
      }
    }

    return [metas, null];
  } catch (error) {
    console.error("Error al obtener las metas financieras por año:", error);
    return [null, "Error interno del servidor"];
  }
} 

