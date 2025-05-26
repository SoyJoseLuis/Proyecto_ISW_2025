"use strict";
import { EntitySchema } from "typeorm";

const NotificacionSchema = new EntitySchema({
  name: "Notificacion",
  tableName: "notificacion",
  columns: {
    idNotificacion: {
      name: "id_notificacion",
      type: "bigint",
      primary: true,
      generated: true,
    },
    descripcionNotificacion: {
      name: "descripcion_notificacion",
      type: "varchar",
      nullable: false,
    }
  },
  relations: {
    panelNotificaciones: {
      type: "many-to-many",
      target: "Estudiante",
      joinTable: {
        name: "panel_notificaciones",
        joinColumn: {
          name: "id_notificacion",
          referencedColumnName: "idNotificacion",
        },
        inverseJoinColumn: {
          name: "rut_estudiante",
          referencedColumnName: "rutEstudiante",
        },
        joinTableColumn: {
          name: "id_actividad",
          referencedColumnName: "idActividad",
          target: "Actividad"
        } 
      }
    }
  }
});

export default NotificacionSchema; 