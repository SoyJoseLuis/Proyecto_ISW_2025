  "use strict";
import { EntitySchema } from "typeorm";

const EstadoActividadSchema = new EntitySchema({
  name: "EstadoActividad",
  tableName: "estado_actividad",
  columns: {
    idEstadoActividad: {
      name: "id_estado_actividad",
      type: "bigint",
      primary: true,
      generated: true,
    },
    descripcionEstadoActividad: {
      name: "descripcion_estado_actividad",
      type: "varchar",
      length: 30,
      nullable: false,
    }
  },
  relations: {
    actividades: {
      type: "one-to-many",
      target: "Actividad",
      inverseSide: "estadoActividad"
    }
  }
});

export default EstadoActividadSchema; 