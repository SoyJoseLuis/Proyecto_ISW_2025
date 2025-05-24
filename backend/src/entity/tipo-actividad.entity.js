"use strict";
import { EntitySchema } from "typeorm";

const TipoActividadSchema = new EntitySchema({
  name: "TipoActividad",
  tableName: "tipo_actividad",
  columns: {
    idTipoActividad: {
      name: "id_tipo_actividad",
      type: "bigint",
      primary: true,
      generated: true,
    },
    descripcionTipoActividad: {
      name: "descripcion_tipo_actividad",
      type: "varchar",
      length: 30,
      nullable: false,
    },
    finesDeLucro: {
      name: "fines_de_lucro",
      type: "boolean",
      nullable: false,
    }
  },
  relations: {
    actividades: {
      type: "one-to-many",
      target: "Actividad",
      inverseSide: "tipoActividad"
    }
  }
});

export default TipoActividadSchema; 