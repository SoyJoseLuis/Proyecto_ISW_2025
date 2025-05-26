import { EntitySchema } from "typeorm";

const PanelNotificacionesSchema = new EntitySchema({
  name: "PanelNotificaciones",
  tableName: "panel_notificaciones",
  columns: {
    rutEstudiante: {
      name: "rut_estudiante",
      type: "varchar",
      length: 12,
      primary: true
    },
    idNotificacion: {
      name: "id_notificacion",
      type: "bigint",
      primary: true
    },
    idActividad: {
      name: "id_actividad",
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
    notificacion: {
      type: "many-to-one",
      target: "Notificacion",
      joinColumn: {
        name: "id_notificacion",
        referencedColumnName: "idNotificacion"
      }
    },
    actividad: {
      type: "many-to-one",
      target: "Actividad",
      joinColumn: {
        name: "id_actividad",
        referencedColumnName: "idActividad"
      }
    }
  }
});

export default PanelNotificacionesSchema; 