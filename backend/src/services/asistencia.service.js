// src/services/asistencia.service.js
import { AppDataSource }          from "../config/configDb.js";
import Actividad                  from "../entity/actividad.entity.js";
import TokenAsistencia            from "../entity/token-asistencia.entity.js";
import AsistenciaActividad        from "../entity/asistencia-actividad.entity.js";

// Repositorios del typeORM para cada entidad
const actividadRepo  = AppDataSource.getRepository(Actividad);
const tokenRepo      = AppDataSource.getRepository(TokenAsistencia);
const asistenciaRepo = AppDataSource.getRepository(AsistenciaActividad);




/*El profe dijo que no podemos nosotros enviar el rut del estudiante porque es inseguro, asique vamos a cambiar lo que tenemos por algo con 
 req.user creo */

/**
 * Genera y guarda un token activo de 4 dígitos para una actividad.
 * @throws {Error("ACTIVIDAD_NOT_FOUND")}
 */


export async function generateTokenService(idActividad) {
  // 1) Validar si la actividad existe
  const actividad = await actividadRepo.findOneBy({ idActividad });
  if (!actividad) throw new Error("ACTIVIDAD_NOT_FOUND");

  // 2) Verificar que no haya ya un token activo
  const existente = await tokenRepo.findOneBy({
    idActividad,
    estadoToken: true
  });
  if (existente) throw new Error("TOKEN_ACTIVE_EXISTS");

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





/**
 * Registra el submit de un token por parte de un estudiante sin necesariamente enviar su rut
 * @throws {Error("INVALID_TOKEN"|"TOKEN_ALREADY_SUBMITTED")}
 */


export async function submitTokenService(idActividad, rutEstudiante, tokenCode) {

    // Valida si el token estáactivo
  const tok = await tokenRepo.findOneBy({ idActividad, codigoToken: tokenCode });
  if (!tok || !tok.estadoToken) throw new Error("INVALID_TOKEN");
    //Valida si el token ya existe
  const exists = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (exists) throw new Error("TOKEN_ALREADY_SUBMITTED");
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



/**
 * Actualiza la confirmación de asistencia por parte del presidente.
 * @throws {Error("RECORD_NOT_FOUND")}
 */


export async function confirmAttendanceService(idActividad, rutEstudiante, confirm) {
    // Busca en la lista que ya existe
  const record = await asistenciaRepo.findOneBy({ idActividad, rutEstudiante });
  if (!record) throw new Error("RECORD_NOT_FOUND");
   // El pressidente en una tipo de checkbox puede colocar si está presente el estudiante o no, y se actualizará su dobleConfirmacion a true
  record.dobleConfirmacion = confirm;
  await asistenciaRepo.save(record);
  return record;
}



/** Devuelve la lista completa de asistencias para la actividad */
export async function listAllService(idActividad) {
  return asistenciaRepo.find({
    where: { idActividad },
    relations: ["estudiante"],
  });
}
