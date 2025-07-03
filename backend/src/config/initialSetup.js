"use strict";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

import User from "../entity/user.entity.js";
import TipoTransaccion from "../entity/tipo-transaccion.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import TipoActividad from "../entity/tipo-actividad.entity.js";
import EstadoActividad from "../entity/estado-actividad.entity.js";
import Notificacion from "../entity/notificacion.entity.js";
import Rol from "../entity/rol.entity.js";
import EstudianteRol from "../entity/estudiante-rol.entity.js";


/**
 * Crea usuarios por defecto si no existen.
 */
async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
          rut: "20.630.735-8",
          email: "usuario2.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

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
 * Crea los 4 roles específicos para el CEE si no existen.
 */
async function createRoles() {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);
    const count = await rolRepository.count();
    if (count > 0) return;

    await Promise.all([
      rolRepository.save(rolRepository.create({ descripcionRol: "Tesorero" })),
      rolRepository.save(rolRepository.create({ descripcionRol: "Presidente" })),
      rolRepository.save(rolRepository.create({ descripcionRol: "Secretario" })),
      rolRepository.save(rolRepository.create({ descripcionRol: "Inactivo" })),
    ]);
    console.log("* => Roles del CEE creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
  }
}

/**
 * Asigna roles de ejemplo a algunos estudiantes.
 */
async function assignSampleRoles() {
  try {
    const estudianteRolRepository = AppDataSource.getRepository(EstudianteRol);
    const count = await estudianteRolRepository.count();
    if (count > 0) return;

    // Asignar roles a los estudiantes de ejemplo
    const rolesAsignaciones = [
      { rutEstudiante: "21457999-5", idRol: 2 }, // María Pérez - Presidente
      { rutEstudiante: "21332767-4", idRol: 1 }, // Juan Soto - Tesorero
      { rutEstudiante: "20123456-7", idRol: 3 }, // Lucía Fernández - Secretario
      { rutEstudiante: "22334556-1", idRol: 4 }, // Carlos Gómez - Inactivo
    ];

    await Promise.all(
      rolesAsignaciones.map((asignacion) =>
        estudianteRolRepository.save(estudianteRolRepository.create(asignacion))
      )
    );
    console.log("* => Roles de ejemplo asignados a estudiantes exitosamente");
  } catch (error) {
    console.error("Error al asignar roles a estudiantes:", error);
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
  assignSampleRoles,
  createEstudiantes,
  createEstadoActividad,
  createNotificacion,
  createRoles,
  createTipoActividad,
  createTiposTransaccion,
  createUsers
};
