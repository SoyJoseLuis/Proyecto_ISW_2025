"use strict";
import { EntitySchema } from "typeorm";

const RolSchema = new EntitySchema({
  name: "Rol",
  tableName: "rol",
  columns: {
    idRol: {
      name: "id_rol",
      type: "bigint",
      primary: true,
      generated: true,
    },
    descripcionRol: {
      name: "descripcion_rol",
      type: "varchar",
      length: 50,
      nullable: false,
    }
  },
  relations: {
    estudiantes: {
      type: "many-to-many",
      target: "Estudiante",
      joinTable: {
        name: "estudiante_rol",
        joinColumn: {
          name: "id_rol",
          referencedColumnName: "idRol",
        },
        inverseJoinColumn: {
          name: "rut_estudiante",
          referencedColumnName: "rutEstudiante",
        },
      },
    }
  }
});

export default RolSchema; 