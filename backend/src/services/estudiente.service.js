import { AppDataSource } from "../config/configDb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import EstudianteSchema from "../entity/estudiante.entity.js";

export const loginStudent = async (correoEstudiante, passEstudiante) => {
  try {
    // Usa SIEMPRE el repositorio del DataSource:
    const studentRepository = AppDataSource.getRepository(EstudianteSchema);

    const student = await studentRepository.findOne({
      where: { correoEstudiante }
    });

    if (!student) {
      return {
        error: true,
        message: "Estudiante no encontrado",
      };
    }

    const isPasswordValid = await bcrypt.compare(passEstudiante, student.passEstudiante);
    if (!isPasswordValid) {
      return {
        error: true,
        message: "Contraseña inválida",
      };
    }

    if (student.fechaDesactivacion) {
      return {
        error: true,
        message: "Cuenta desactivada",
      };
    }

    const token = jwt.sign(
      {
        rutEstudiante: student.rutEstudiante,
        correoEstudiante: student.correoEstudiante,
        role: "estudiante",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Actualizar sesionEstudiante a true
    student.sesionEstudiante = true;
    await studentRepository.save(student);

    return {
      statusCode: 200,
      message: "Inicio de sesión exitoso",
      data: {
        token,
        student: {
          rutEstudiante: student.rutEstudiante,
          correoEstudiante: student.correoEstudiante,
          nombreEstudiante: student.nombreEstudiante,
        }
      }
    };
  } catch (error) {
    console.error("ERROR EN LOGIN:", error);
    return {
      error: true,
      message: "Error interno al iniciar sesión",
    };
  }
};
