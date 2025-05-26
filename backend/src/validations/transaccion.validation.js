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
    .pattern(/^[0-9]{7,8}-[0-9kK]$/)
    .custom((value, helpers) => {
      // Función para validar el dígito verificador
      const validarRut = (rut) => {
        const [numero, dv] = rut.split("-");
        const dvCalculado = calcularDV(numero);
        return dvCalculado.toLowerCase() === dv.toLowerCase();
      };

      const calcularDV = (numero) => {
        let suma = 0;
        let multiplicador = 2;
        
        // Recorre el número de derecha a izquierda
        for (let i = numero.length - 1; i >= 0; i--) {
          suma += parseInt(numero[i]) * multiplicador;
          multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }
        
        const resto = suma % 11;
        const dv = 11 - resto;
        
        if (dv === 11) return "0";
        if (dv === 10) return "k";
        return dv.toString();
      };

      if (!validarRut(value)) {
        return helpers.message("RUT inválido: dígito verificador no corresponde");
      }
      return value;
    })
    .required()
    .messages({
      "string.pattern.base": "El rut debe tener el formato XXXXXXXX-X (sin puntos).",
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