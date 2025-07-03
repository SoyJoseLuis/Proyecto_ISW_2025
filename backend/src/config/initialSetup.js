"use strict";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

//import User from "../entity/user.entity.js";
import TipoTransaccion from "../entity/tipo-transaccion.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import TipoActividad from "../entity/tipo-actividad.entity.js";
import EstadoActividad from "../entity/estado-actividad.entity.js";
import Notificacion from "../entity/notificacion.entity.js";


/**
 * Crea los tipos de transacción ('Ingreso' y 'Salida') si no existen.
 */
async function createTiposTransaccion() {
  try {
    const repo = AppDataSource.getRepository(TipoTransaccion);
    const count = await repo.count();
    if (count > 0) return;

    await Promise.all([
      repo.save(repo.create({ descripcionTransaccion: "Ingreso" })),
      repo.save(repo.create({ descripcionTransaccion: "Salida" })),
    ]);
    console.log("* => Tipos de transacción creados exitosamente");
  } catch (error) {
    console.error("Error al crear tipos de transacción:", error);
  }
}

/**
 * Crea datos de ejemplo para la tabla Estudiante.
 */
async function createEstudiantes() {
  try {
    const repo = AppDataSource.getRepository(Estudiante);
    const count = await repo.count();
    if (count > 0) return;

    // Datos de ejemplo coherentes para Estudiante
    const sample = [
      {
        rutEstudiante: "21457999-5",
        nombreEstudiante: "María Pérez",
        correoEstudiante: "maria.perez@alumnos.uni.cl",
        passEstudiante: await encryptPassword("pass1234"),
        sesionEstudiante: true,
        fechaDesactivacion: null,
        generacionIngreso: 2025,
      },
      {
        rutEstudiante: "21332767-4",
        nombreEstudiante: "Juan Soto",
        correoEstudiante: "juan.soto@alumnos.uni.cl",
        passEstudiante: await encryptPassword("pass1234"),
        sesionEstudiante: true,
        fechaDesactivacion: null,
        generacionIngreso: 2025,
      },
      {
        rutEstudiante: "20123456-7",
        nombreEstudiante: "Lucía Fernández",
        correoEstudiante: "lucia.fernandez@alumnos.uni.cl",
        passEstudiante: await encryptPassword("pass1234"),
        sesionEstudiante: true,
        fechaDesactivacion: null,
        generacionIngreso: 2025,
      },
      {
        rutEstudiante: "22334556-1",
        nombreEstudiante: "Carlos Gómez",
        correoEstudiante: "carlos.gomez@alumnos.uni.cl",
        passEstudiante: await encryptPassword("pass1234"),
        sesionEstudiante: true,
        fechaDesactivacion: null,
        generacionIngreso: 2025,
      },
    ];

    await Promise.all(sample.map((e) => repo.save(repo.create(e))));
    console.log("* => Estudiantes creados exitosamente");
  } catch (error) {
    console.error("Error al crear estudiantes:", error);
  }
}

/**
 * Crea datos de ejemplo para la tabla TipoActividad.
 */
async function createTipoActividad() {
  try {
    const repo = AppDataSource.getRepository(TipoActividad);
    const count = await repo.count();
    if (count > 0) return;

    await Promise.all([
      repo.save(repo.create({ idTipoActividad: 0, descripcionTipoActividad: "Sin venta", finesDeLucro: false })),
      repo.save(repo.create({ idTipoActividad: 1, descripcionTipoActividad: "Con venta", finesDeLucro: true })),
    ]);
    console.log("* => Tipos de actividad creados exitosamente");
  } catch (error) {
    console.error("Error al crear tipos de actividad:", error);
  }
}

/**
 * Crea datos de ejemplo para la tabla EstadoActividad.
 */
async function createEstadoActividad() {
  try {
    const repo = AppDataSource.getRepository(EstadoActividad);
    const count = await repo.count();
    if (count > 0) return;

    await Promise.all([
      repo.save(repo.create({ descripcionEstadoActividad: "En proceso" })),
      repo.save(repo.create({ descripcionEstadoActividad: "Archivada" })),
      repo.save(repo.create({ descripcionEstadoActividad: "Pendiente" })),
      repo.save(repo.create({ descripcionEstadoActividad: "Finalizada" }))
    ]);
    console.log("* => Estados de actividad creados exitosamente");
  } catch (error) {
    console.error("Error al crear estados de actividad:", error);
  }
}


/**
 * Crea la notificación inicial (id=1) si no existe.
 */
async function createNotificacion() {
  try {
    const repo = AppDataSource.getRepository(Notificacion);
    const count = await repo.count();
    // Si ya existe alguna notificación, no hace nada (opcional: podrías buscar por ID si lo prefieres)
    if (count > 0) return;

    await repo.save(
      repo.create({
        idNotificacion: 1, // O el nombre que uses para la PK en el entity
        descripcionNotificacion: "El CEE ICINF ha creado una actividad."
      })
    );
    console.log("* => Notificación creada exitosamente");
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
}





export {
  createEstudiantes,
  createEstadoActividad,
  createNotificacion,
  createTipoActividad,
  createTiposTransaccion,
};
