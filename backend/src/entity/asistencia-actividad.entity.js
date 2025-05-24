import { EntitySchema } from "typeorm";

const AsistenciaActividadSchema = new EntitySchema({
  name: "AsistenciaActividad",
  tableName: "asistencia_actividad",
  columns: {
    idActividad: {
      name: "id_actividad",
      type: "bigint",
      primary: true
    },
    rutEstudiante: {
      name: "rut_estudiante",
      type: "varchar",
      length: 12,
      primary: true
    },
    dobleConfirmacion: {
      name: "doble_confirmacion",
      type: "boolean",
      nullable: true
    }
  },
  relations: {
    actividad: {
      type: "many-to-one",
      target: "Actividad",
      joinColumn: {
        name: "id_actividad",
        referencedColumnName: "idActividad"
      }
    },
    estudiante: {
      type: "many-to-one",
      target: "Estudiante",
      joinColumn: {
        name: "rut_estudiante",
        referencedColumnName: "rutEstudiante"
      }
    }
  }
});

export default AsistenciaActividadSchema; 