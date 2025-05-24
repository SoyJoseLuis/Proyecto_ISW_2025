import { EntitySchema } from "typeorm";

const EstudianteRolSchema = new EntitySchema({
  name: "EstudianteRol",
  tableName: "estudiante_rol",
  columns: {
    rutEstudiante: {
      name: "rut_estudiante",
      type: "varchar",
      length: 12,
      primary: true
    },
    idRol: {
      name: "id_rol",
      type: "bigint",
      primary: true
    }
  },
  relations: {
    estudiante: {
      type: "many-to-one",
      target: "Estudiante",
      joinColumn: {
        name: "rut_estudiante",
        referencedColumnName: "rutEstudiante"
      }
    },
    rol: {
      type: "many-to-one",
      target: "Rol",
      joinColumn: {
        name: "id_rol",
        referencedColumnName: "idRol"
      }
    }
  }
});

export default EstudianteRolSchema; 