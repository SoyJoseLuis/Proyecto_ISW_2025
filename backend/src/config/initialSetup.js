"use strict";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

//import User from "../entity/user.entity.js";
import TipoTransaccion from "../entity/tipo-transaccion.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import TipoActividad from "../entity/tipo-actividad.entity.js";
import EstadoActividad from "../entity/estado-actividad.entity.js";
import Notificacion from "../entity/notificacion.entity.js";
import Rol from "../entity/rol.entity.js";
import EstudianteRol from "../entity/estudiante-rol.entity.js";
import BalanceCee from "../entity/balance-cee.entity.js";


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
      {
        rutEstudiante: "22334556-3",
        nombreEstudiante: "Carlos Cadiz",
        correoEstudiante: "carlos.cadiz@alumnos.uni.cl",
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

/**
 * Crea balances históricos para años anteriores si no existen.
 * Verifica año por año y crea los que falten de los últimos 5 años.
 */
async function createBalancesHistoricos() {
  try {
    console.log(" Iniciando creación de balances históricos...");
    const repo = AppDataSource.getRepository(BalanceCee);
    const añoActual = new Date().getFullYear();
    
    // Verificar y crear balances para los últimos 5 años (excluyendo el año actual)
    for (let i = 5; i >= 1; i--) {
      const año = añoActual - i;
      const periodoStr = año.toString();
      
      // Verificar si ya existe un balance para este año
      const existeBalance = await repo.findOne({
        where: { periodo: periodoStr }
      });
      
      if (!existeBalance) {
        console.log(`Creando balance para el año ${año}...`);
        
        // Generar valores realistas asegurando que el balance sea positivo
        const totalIngresos = Math.floor(Math.random() * 500000) + 100000; // 100k - 600k
        const totalSalidas = Math.floor(Math.random() * (totalIngresos * 0.8)) + Math.floor(totalIngresos * 0.1);
        const montoActual = totalIngresos - totalSalidas;
        
        const nuevoBalance = {
          periodo: periodoStr,
          montoActual: montoActual,
          totalIngresos: totalIngresos,
          totalSalidas: totalSalidas
        };
        
        await repo.save(repo.create(nuevoBalance));
      } else {
        console.log(`Ya existe balance para el año ${año}, saltando...`);
      }
    }
    
    console.log("* => Balances históricos creados exitosamente");
  } catch (error) {
    console.error("Error al crear balances históricos:", error);
  }
}


export {
  assignSampleRoles,
  createBalancesHistoricos,
  createEstudiantes,
  createEstadoActividad,
  createNotificacion,
  createRoles,
  createTipoActividad,
  createTiposTransaccion,
};
