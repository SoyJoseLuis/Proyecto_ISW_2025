// src/controllers/asistencia.controller.js

import { AppDataSource } from "../config/configDb.js";
import Actividad from "../entity/actividad.entity.js";
import AsistenciaActividad from "../entity/asistencia-actividad.entity.js";
import TokenAsistencia from "../entity/token-asistencia.entity.js";

// Repositorios de TypeORM para cada entidad
const actividadRepo  = AppDataSource.getRepository(Actividad);
const asistenciaRepo = AppDataSource.getRepository(AsistenciaActividad);
const tokenRepo      = AppDataSource.getRepository(TokenAsistencia);

/**
 * Genera un token numérico de 4 dígitos para una actividad en proceso.
 */
export const generateToken = async (req, res) => {
  const { idActividad } = req.params;

  // 1. Validar existencia de la actividad y que esté abierta hoy
  const actividad = await actividadRepo.findOneBy({ idActividad });
  if (!actividad)
    return res.status(404).json({ error: "Actividad no existe" });

  // Opcional: comprobar estado y fecha de la actividad aquí...

  // 2. Generar código aleatorio de 4 dígitos
  const code = Math.floor(1000 + Math.random() * 9000);

  // 3. Crear y guardar el token en la BD
  const token = tokenRepo.create({
    idActividad,
    codigoToken: code,
    estadoToken: true,
  });
  await tokenRepo.save(token);

  // 4. Devolver el token al caller
  return res.json({ token: code });
};

/**
 * El estudiante envía su RUT y el token para marcarse presente (dobleConfirmacion: false).
 */
export const submitToken = async (req, res) => {
  const { idActividad } = req.params;
  const { rutEstudiante, token } = req.body;

  // 1. Validar token activo
  const tok = await tokenRepo.findOneBy({ idActividad, codigoToken: token });
  if (!tok || !tok.estadoToken)
    return res.status(401).json({ error: "Token inválido o expirado" });

  // 2. Insertar o ignorar registro de asistencia
  let record = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (record) {
    // Ya está en la lista pendiente
    return res.status(200).json({ message: "Token ya entregado" });
  }

  // 3. Crear nuevo registro con dobleConfirmacion=false
  record = asistenciaRepo.create({
    idActividad,
    rutEstudiante,
    dobleConfirmacion: false,
  });
  await asistenciaRepo.save(record);

  return res.json({ message: "Token recibido, espera confirmación" });
};

/**
 * Lista todas las entregas de token pendientes (dobleConfirmacion = false).
 */
export const listPending = async (req, res) => {
  const { idActividad } = req.params;

  const pendientes = await asistenciaRepo.find({
    where: { idActividad, dobleConfirmacion: false },
    relations: ["estudiante"],  // para mostrar nombre, email, etc.
  });

  return res.json({ pendientes });
};

/**
 * Presidente confirma o deniega la asistencia real de un estudiante.
 */
export const confirmAttendance = async (req, res) => {
  const { idActividad, rutEstudiante } = req.params;
  const { confirm } = req.body;  // true=presente, false=ausente

  // 1. Buscar registro existente
  const record = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (!record)
    return res.status(404).json({ error: "Registro no encontrado" });

  // 2. Actualizar dobleConfirmacion
  record.dobleConfirmacion = confirm;
  await asistenciaRepo.save(record);

  return res.json({ message: "Asistencia confirmada", record });
};

/**
 * Lista definitiva de todos los estudiantes con su dobleConfirmacion.
 */
export const listAll = async (req, res) => {
  const { idActividad } = req.params;

  const all = await asistenciaRepo.find({
    where: { idActividad },
    relations: ["estudiante"],
  });

  return res.json({ asistencia: all });
};
