"use strict";
import Joi from "joi";

export const metaQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
      "any.required": "El id es requerido.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const metaBodyValidation = Joi.object({
  metaFinanciera: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La meta financiera debe ser un número.",
      "number.integer": "La meta financiera debe ser un número entero.",
      "number.positive": "La meta financiera debe ser un número positivo.",
      "any.required": "La meta financiera es requerida.",
    }),
  periodo: Joi.string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "El periodo debe ser un año en formato YYYY",
      "string.empty": "El periodo no puede estar vacío.",
      "any.required": "El periodo es requerido.",
    }),
  descripcionMeta: Joi.string()
    .min(10)
    .max(50)
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción debe tener como máximo 50 caracteres.",
      "any.required": "La descripción es requerida.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });