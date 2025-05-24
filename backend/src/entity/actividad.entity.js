"use strict";
import { EntitySchema } from "typeorm";

const ActividadSchema = new EntitySchema({
  name: "Actividad",
  tableName: "actividad",
  columns: {
    idActividad: {
      name: "id_actividad",
      type: "bigint",
      primary: true,
      generated: true,
    },
    descripcionActividad: {
      name: "descripcion_actividad",
      type: "varchar",
      length: 100,
      nullable: false,
    },
    tituloActividad: {
      name: "titulo_actividad",
      type: "varchar",
      length: 25,
      nullable: false,
    },
    fechaActividad: {
      name: "fecha_actividad",
      type: "varchar",
      length: 10,
      nullable: false,
    },
    horaInicioActividad: {
      name: "hora_inicio_actividad",
      type: "varchar",
      length: 8,
      nullable: false,
    },
    horaTerminoActividad: {
      name: "hora_termino_actividad",
      type: "varchar",
      length: 8,
      nullable: false,
    },
    ubicacionActividad: {
      name: "ubicacion_actividad",
      type: "varchar",
      length: 40,
      nullable: false,
    },
    idEstadoActividad: {
      name: "id_estado_actividad",
      type: "bigint",
      nullable: false,
    },
    idTipoActividad: {
      name: "id_tipo_actividad",
      type: "bigint",
      nullable: false,
    }
  },
  relations: {
    estadoActividad: {
      type: "many-to-one",
      target: "EstadoActividad",
      joinColumn: {
        name: "id_estado_actividad",
      },
    },
    tipoActividad: {
      type: "many-to-one",
      target: "TipoActividad",
      joinColumn: {
        name: "id_tipo_actividad",
      },
    },
    asistencias: {
      type: "many-to-many",
      target: "Estudiante",
      joinTable: {
        name: "asistencia_actividad",
        joinColumn: {
          name: "id_actividad",
          referencedColumnName: "idActividad",
        },
        inverseJoinColumn: {
          name: "rut_estudiante",
          referencedColumnName: "rutEstudiante",
        },
      },
    },
    tokens: {
      type: "one-to-many",
      target: "TokenAsistencia",
      inverseSide: "actividad",
    }
  }
});

export default ActividadSchema; 