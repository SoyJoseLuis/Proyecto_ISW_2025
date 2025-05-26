// src/controllers/asistencia.controller.js

import { AppDataSource } from "../config/configDb.js";
import Actividad from "../entity/actividad.entity.js";
import AsistenciaActividad from "../entity/asistencia-actividad.entity.js";
import TokenAsistencia from "../entity/token-asistencia.entity.js";

// Repositorios del typeORM para cada entidad
const actividadRepo  = AppDataSource.getRepository(Actividad);
const asistenciaRepo = AppDataSource.getRepository(AsistenciaActividad);
const tokenRepo      = AppDataSource.getRepository(TokenAsistencia);

/**
 * Genera un token de 4 digitos para una actividad en PROCESO
 */
export const generateToken = async (req, res) => {
  const { idActividad } = req.params;

  // Validar si la actividad existe
  const actividad = await actividadRepo.findOneBy({ idActividad });
  if (!actividad)
    return res.status(404).json({ error: "Actividad no existe" });

  // Comprobar estado --> Falta hacer

  // Genera el token aleatorio de 4 digitos
  const code = Math.floor(1000 + Math.random() * 9000);

  // Crea y guarda el token en la BD
  const token = tokenRepo.create({
    idActividad,
    codigoToken: code,
    estadoToken: true,
  });
  await tokenRepo.save(token);

  // Devuelve el token 
  return res.json({ token: code });
};



/**
 * El estudiante envía su RUT y el token para marcarse presente (dobleConfirmacion --> aún en falso)
 */
export const submitToken = async (req, res) => {
  const { idActividad } = req.params;
  const { rutEstudiante, token } = req.body;

  // Valida si el token estáactivo
  const tok = await tokenRepo.findOneBy({ idActividad, codigoToken: token });
  if (!tok || !tok.estadoToken)
    return res.status(401).json({ error: "Token inválido o expirado" });

  // Insertar o ignorar registro de asistencia
  let record = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (record) {
    // Ya está en la lista pendiente
    return res.status(200).json({ message: "Token ya entregado" });
  }

  // Crea la  nueva lista con dobleConfirmacion en falso
  record = asistenciaRepo.create({
    idActividad,
    rutEstudiante,
    dobleConfirmacion: false,
  });
  await asistenciaRepo.save(record);

  return res.json({ message: "Token recibido, espera confirmación" });
};

/**
 * Genera una lista con todas las entregas de token pendientes (dobleConfirmacion en falso)
 */
export const listPending = async (req, res) => {
  const { idActividad } = req.params;

  const pendientes = await asistenciaRepo.find({
    where: { idActividad, dobleConfirmacion: false },
    relations: ["estudiante"],  // para mostrar nombre, email,   (Mucha información para mostrar, hay que modificarlo)
  });

  return res.json({ pendientes });
};

/**
 * Presidente confirma o saca de  la asistencia real a un estudiante
 */
export const confirmAttendance = async (req, res) => {
  const { idActividad, rutEstudiante } = req.params;
  const { confirm } = req.body;  // true=presente  | falso=ausente

  // Busca en la lista que ya existe 
  const record = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (!record)
    return res.status(404).json({ error: "Registro no encontrado" });

  // El pressidente en una tipo de checkbox puede colocar si está presente el estudiante o no, y se actualizará su dobleConfirmacion a true
  record.dobleConfirmacion = confirm;
  await asistenciaRepo.save(record);

  return res.json({ message: "Asistencia confirmada", record });
};

/**
 * Lista definitiva de todos los estudiantes con su dobleConfirmacion en true
 */
export const listAll = async (req, res) => {
  const { idActividad } = req.params;

  const all = await asistenciaRepo.find({
    where: { idActividad },
    relations: ["estudiante"],
  });

  return res.json({ asistencia: all });
};
