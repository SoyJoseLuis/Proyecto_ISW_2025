"use strict";
import Joi from "joi";

export const transaccionQueryValidation = Joi.object({
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

export const transaccionBodyValidation = Joi.object({
  montoTransaccion: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El monto debe ser un número.",
      "number.integer": "El monto debe ser un número entero.",
      "number.positive": "El monto debe ser un número positivo.",
      "any.required": "El monto es requerido.",
    }),
  fechaTransaccion: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "La fecha debe tener el formato DD-MM-YYYY.",
      "string.empty": "La fecha no puede estar vacía.",
      "any.required": "La fecha es requerida.",
    }),
  rutEstudiante: Joi.string()
    .pattern(/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/)
    .required()
    .messages({
      "string.pattern.base": "El rut debe tener el formato XX.XXX.XXX-X.",
      "string.empty": "El rut no puede estar vacío.",
      "any.required": "El rut es requerido.",
    }),
  idTipoTransaccion: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El tipo de transacción debe ser un número.",
      "number.integer": "El tipo de transacción debe ser un número entero.",
      "number.positive": "El tipo de transacción debe ser un número positivo.",
      "any.required": "El tipo de transacción es requerido.",
    }),
  motivoTransaccion: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      "string.empty": "El motivo no puede estar vacío.",
      "string.min": "El motivo debe tener al menos 5 caracteres.",
      "string.max": "El motivo debe tener como máximo 30 caracteres.",
      "any.required": "El motivo es requerido.",
    }),
  idActividad: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El id de la actividad debe ser un número.",
      "number.integer": "El id de la actividad debe ser un número entero.",
      "number.positive": "El id de la actividad debe ser un número positivo.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  }); 