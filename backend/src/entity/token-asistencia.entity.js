"use strict";
import { EntitySchema } from "typeorm";

const TokenAsistenciaSchema = new EntitySchema({
  name: "TokenAsistencia",
  tableName: "token_asistencia",
  columns: {
    codigoToken: {
      name: "codigo_token",
      type: "int",
      primary: true,
    },
    idActividad: {
      name: "id_actividad",
      type: "bigint",
      nullable: false,
    },
    estadoToken: {
      name: "estado_token",
      type: "boolean",
      nullable: false,
    }
  },
  relations: {
    actividad: {
      type: "many-to-one",
      target: "Actividad",
      joinColumn: {
        name: "id_actividad",
      }
    }
  }
});

export default TokenAsistenciaSchema; 