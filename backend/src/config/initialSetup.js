"use strict";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

import User from "../entity/user.entity.js";
import TipoTransaccionSchema from "../entity/tipo-transaccion.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import TipoActividad from "../entity/tipo-actividad.entity.js";

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
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
          rut: "20.630.735-8",
          email: "usuario2.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
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
    const repo = AppDataSource.getRepository(TipoTransaccionSchema);
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

    const sample = [
      { rut: "21.457.999-5", nombre: "María Pérez", email: "maria.perez@alumnos.uni.cl" },
      { rut: "19.876.543-2", nombre: "Juan Soto", email: "juan.soto@alumnos.uni.cl" },
      { rut: "20.123.456-7", nombre: "Lucía Fernández", email: "lucia.fernandez@alumnos.uni.cl" },
      { rut: "22.334.556-1", nombre: "Carlos Gómez", email: "carlos.gomez@alumnos.uni.cl" },
    ];

    await Promise.all(
      sample.map((e) => repo.save(repo.create(e)))
    );
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
      repo.save(repo.create({ idTipoActividad: 0, descripcionTipo: "Sin venta", finesDeLucro: false })),
      repo.save(repo.create({ idTipoActividad: 1, descripcionTipo: "Con venta", finesDeLucro: true })),
    ]);
    console.log("* => Tipos de actividad creados exitosamente");
  } catch (error) {
    console.error("Error al crear tipos de actividad:", error);
  }
}

export { createUsers, createTiposTransaccion, createEstudiantes, createTipoActividad };
