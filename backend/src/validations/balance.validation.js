"use strict";
import Joi from "joi";

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