

//Comentar por mientras

/*
import EstudianteSchema from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
  try {
    const estudianteRepository = AppDataSource.getRepository(EstudianteSchema);

    const estudiante = await estudianteRepository.findOne({
      where: { rutEstudiante: req.user.rutEstudiante },
      relations: ["roles"], 
    });

    if (!estudiante) {
      return handleErrorClient(
        res,
        404,
        "Estudiante no encontrado en la base de datos"
      );
    }

    const roles = estudiante.roles.map((rol) => rol.nombreRol || rol.idRol); 

    if (!roles.includes("administrador")) {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de administrador para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message
    );
  }
}

*/