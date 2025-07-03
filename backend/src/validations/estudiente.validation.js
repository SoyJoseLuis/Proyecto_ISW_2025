
import Joi from "joi";


export const studentLoginValidation = Joi.object({
  correoEstudiante: Joi.string()
    .email({ tlds: { allow: false } }) // Opcional: desactiva validación de TLD
    .required()
    .messages({
      "string.email": "Por favor, proporciona un correo válido",
      "any.required": "El correo es obligatorio",
    }),
  passEstudiante: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "any.required": "La contraseña es obligatoria",
    }),
});