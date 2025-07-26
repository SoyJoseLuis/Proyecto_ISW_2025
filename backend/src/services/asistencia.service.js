// src/services/asistencia.service.js
import { AppDataSource }          from "../config/configDb.js";
import Actividad                  from "../entity/actividad.entity.js";
import TokenAsistencia            from "../entity/token-asistencia.entity.js";
import AsistenciaActividad        from "../entity/asistencia-actividad.entity.js";

// Repositorios del typeORM para cada entidad
const actividadRepo  = AppDataSource.getRepository(Actividad);
const tokenRepo      = AppDataSource.getRepository(TokenAsistencia);
const asistenciaRepo = AppDataSource.getRepository(AsistenciaActividad);

// PARA MANEJO DE ERRORES
import { AppError } from "../utils/AppError.js";


/*El profe dijo que no podemos nosotros enviar el rut del estudiante porque es inseguro, asique vamos a cambiar lo que tenemos por algo con 
 req.user creo */


export async function generateTokenService(idActividad) {
  // 1) Validar si la actividad existe
  const actividad = await actividadRepo.findOneBy({ idActividad });
  if (!actividad) throw new AppError(404, "Actividad no existe");

  // 2) Verificar que no haya ya un token activo
  const existente = await tokenRepo.findOneBy({
    idActividad,
    estadoToken: true
  });
  if (existente) throw new AppError(400,"Ya existe un token activo para esta actividad");

  // 3) Generar el token aleatorio de 4 dígitos
  const code = Math.floor(1000 + Math.random() * 9000);

  // 4) Crear y guardar el token en la BD
  const token = tokenRepo.create({
    idActividad,
    codigoToken: code,
    estadoToken: true
  });
  await tokenRepo.save(token);

  return code;
}





export async function submitTokenService(idActividad, rutEstudiante, tokenCode) {

    // Valida si el token estáactivo
  const tok = await tokenRepo.findOneBy({ idActividad, codigoToken: tokenCode });
  if (!tok || !tok.estadoToken) throw new AppError(400, "Token inválido")
    //Valida si el token ya existe
  const exists = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (exists) throw new AppError(409, "Ya enviaste este token");
// Insertar o ignorar registro de asistencia
// Crea la  nueva lista con dobleConfirmacion en falso
  const record = asistenciaRepo.create({ idActividad, rutEstudiante, dobleConfirmacion: false });
  await asistenciaRepo.save(record);
}




/** Devuelve los pendientes (dobleConfirmación = false) */
export async function listPendingService(idActividad) {
  return asistenciaRepo.find({
    where: { idActividad, dobleConfirmacion: false },
    relations: ["estudiante"],
  });
}



export async function confirmAttendanceService(idActividad, rutEstudiante, confirm) {
    // Busca en la lista que ya existe
  const record = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (!record) throw new AppError(404, "Registro no encontrado");
   // El pressidente en una tipo de checkbox puede colocar si está presente el estudiante o no, y se actualizará su dobleConfirmacion a true
  record.dobleConfirmacion = confirm;
  await asistenciaRepo.save(record);
  return record;
}



/** Devuelve la lista completa de asistencias para la actividad */
export async function listAllService(idActividad) {
  return asistenciaRepo.find({
    where: { idActividad, dobleConfirmacion: true },
    relations: ["estudiante"],
  });
}


export async function getCurrentTokenService(idActividad) {
  const tok = await tokenRepo.findOneBy({ idActividad, estadoToken: true });
  if (!tok) throw new AppError(404, "Token no encontrado");
  return tok.codigoToken;
}


/**
 * Registra un envío de token sin necesidad de pasar la actividad:
 * 1) Busca el token activo por código.
 * 2) Extrae idActividad y llama a submitTokenService.
 */
export async function submitTokenByCodeService(tokenCode, rutEstudiante) {
  // 1) Busca token activo
  const tok = await tokenRepo.findOneBy({ codigoToken: tokenCode, estadoToken: true });
  if (!tok) throw new AppError(404, "Token invalido");
  // 2) Reutiliza el service existente
  await submitTokenService(tok.idActividad, rutEstudiante, tokenCode);
}