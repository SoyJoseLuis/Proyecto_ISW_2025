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
  porcentajeCrecimiento: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .messages({
      "number.base": "El porcentaje de crecimiento debe ser un número.",
      "number.integer": "El porcentaje de crecimiento debe ser un número entero.",
      "number.min": "El porcentaje de crecimiento no puede ser menor a 0.",
      "number.max": "El porcentaje de crecimiento no puede ser mayor a 100.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  }); 