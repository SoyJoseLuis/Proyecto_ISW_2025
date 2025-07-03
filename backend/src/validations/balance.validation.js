"use strict";
import Joi from "joi";

export const balanceQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  periodo: Joi.string()
    .min(4)
    .max(10)
    .pattern(/^\d{4}(-\d{1,2})?$/)
    .messages({
      "string.empty": "El período no puede estar vacío.",
      "string.base": "El período debe ser de tipo string.",
      "string.min": "El período debe tener como mínimo 4 caracteres.",
      "string.max": "El período debe tener como máximo 10 caracteres.",
      "string.pattern.base": "El período debe tener formato YYYY o YYYY-MM.",
    }),
})
  .or("id", "periodo")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id o periodo.",
  });

export const balanceBodyValidation = Joi.object({
  montoActual: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "El monto actual debe ser un número.",
      "number.integer": "El monto actual debe ser un número entero.",
      "number.min": "El monto actual no puede ser negativo.",
      "any.required": "El monto actual es requerido.",
    }),
  totalIngresos: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "El total de ingresos debe ser un número.",
      "number.integer": "El total de ingresos debe ser un número entero.",
      "number.min": "El total de ingresos no puede ser negativo.",
      "any.required": "El total de ingresos es requerido.",
    }),
  totalSalidas: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "El total de salidas debe ser un número.",
      "number.integer": "El total de salidas debe ser un número entero.",
      "number.min": "El total de salidas no puede ser negativo.",
      "any.required": "El total de salidas es requerido.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  }); 