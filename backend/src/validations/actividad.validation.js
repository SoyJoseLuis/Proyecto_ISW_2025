import Joi from "joi";

export const actividadBodyValidation = Joi.object({
  descripcionActividad: Joi.string()
    .max(50)
    .required()
    .messages({
      "string.base": "La descripción debe ser un texto.",
      "string.max": "La descripción puede tener como máximo 50 caracteres.",
      "any.required": "La descripción es requerida.",
    }),
  tituloActividad: Joi.string()
    .max(25)
    .required()
    .messages({
      "string.base": "El título debe ser un texto.",
      "string.max": "El título puede tener como máximo 25 caracteres.",
      "any.required": "El título es requerido.",
    }),
  fechaActividad: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La fecha debe tener formato YYYY-MM-DD.",
      "any.required": "La fecha es requerida.",
    }),
  horaInicioActividad: Joi.string()
    .pattern(/^\d{2}:\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La hora de inicio debe tener formato HH:MM:SS.",
      "any.required": "La hora de inicio es requerida.",
    }),
  horaTerminoActividad: Joi.string()
    .pattern(/^\d{2}:\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La hora de término debe tener formato HH:MM:SS.",
      "any.required": "La hora de término es requerida.",
    }),
  ubicacionActividad: Joi.string()
    .max(40)
    .required()
    .messages({
      "string.base": "La ubicación debe ser un texto.",
      "string.max": "La ubicación puede tener como máximo 40 caracteres.",
      "any.required": "La ubicación es requerida.",
    }),
  idEstadoActividad: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "El estado debe ser un número.",
      "number.integer": "El estado debe ser un número entero.",
      "number.min": "El estado debe ser un valor válido.",
      "any.required": "El estado es requerido.",
    }),
  idTipoActividad: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "El tipo debe ser un número.",
      "number.integer": "El tipo debe ser un número entero.",
      "number.min": "El tipo debe ser un valor válido.",
      "any.required": "El tipo es requerido.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
