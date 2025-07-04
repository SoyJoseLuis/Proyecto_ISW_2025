"use strict";
import Joi from "joi";

export const rutValidation = Joi.object({
  rut: Joi.string()
    .min(9)
    .max(12)
    .required()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El RUT no puede estar vacío.",
      "string.base": "El RUT debe ser de tipo string.",
      "string.min": "El RUT debe tener como mínimo 9 caracteres.",
      "string.max": "El RUT debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato de RUT inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
      "any.required": "El RUT es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  }); 