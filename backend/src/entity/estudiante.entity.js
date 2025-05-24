"use strict";
import { EntitySchema } from "typeorm";

const EstudianteSchema = new EntitySchema({
  name: "Estudiante",
  tableName: "estudiante",
  columns: {
    rutEstudiante: {
      name: "rut_estudiante",
      type: "varchar",
      length: 12,
      primary: true,
    },
    nombreEstudiante: {
      name: "nombre_estudiante",
      type: "varchar",
      length: 15,
      nullable: false,
    },
    passEstudiante: {
      name: "pass_estudiante",
      type: "varchar",
      length: 84,
      nullable: false,
    },
    sesionEstudiante: {
      name: "sesion_estudiante",
      type: "boolean",
      nullable: false,
    },
    fechaDesactivacion: {
      name: "fecha_desactivacion",
      type: "varchar",
      length: 10,
      nullable: true,
    },
    correoEstudiante: {
      name: "correo_estudiante",
      type: "varchar",
      length: 50,
      nullable: false,
    },
    generacionIngreso: {
      name: "generacion_ingreso",
      type: "int",
      nullable: false,
    }
  },
  indices: [
    {
      name: "IDX_ESTUDIANTE_RUT",
      columns: ["rutEstudiante"],
      unique: true,
    }
  ],
  relations: {
    roles: {
      type: "many-to-many",
      target: "Rol",
      joinTable: {
        name: "estudiante_rol",
        joinColumn: {
          name: "rut_estudiante",
          referencedColumnName: "rutEstudiante",
        },
        inverseJoinColumn: {
          name: "id_rol",
          referencedColumnName: "idRol",
        },
      },
    },
    asistencias: {
      type: "many-to-many",
      target: "Actividad",
      joinTable: {
        name: "asistencia_actividad",
        joinColumn: {
          name: "rut_estudiante",
          referencedColumnName: "rutEstudiante",
        },
        inverseJoinColumn: {
          name: "id_actividad",
          referencedColumnName: "idActividad",
        },
      },
    }
  }
});

export default EstudianteSchema; 