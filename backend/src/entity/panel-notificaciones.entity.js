"use strict";
import { EntitySchema } from "typeorm";

const PanelNotificacionesSchema = new EntitySchema({
  name: "PanelNotificaciones",
  tableName: "panel_notificaciones",
  columns: {
    rutEstudiante: {
      name: "rut_estudiante",
      type: "varchar",
      length: 12,
      primary: true,
    },
    idActividad: {
      name: "id_actividad",
      type: "bigint",
      primary: true,
    },
    idNotificacion: {
      name: "id_notificacion",
      type: "bigint",
      nullable: false,
    },
  },
  relations: {
    estudiante: {
      type: "many-to-one",
      target: "Estudiante",
      joinColumn: { name: "rut_estudiante", referencedColumnName: "rutEstudiante" },
      onDelete: "CASCADE"
    },
    actividad: {
      type: "many-to-one",
      target: "Actividad",
      joinColumn: { name: "id_actividad", referencedColumnName: "idActividad" },
      onDelete: "CASCADE"
    },
    notificacion: {
      type: "many-to-one",
      target: "Notificacion",
      joinColumn: { name: "id_notificacion", referencedColumnName: "idNotificacion" },
      onDelete: "CASCADE"
    }
  }
});

export default PanelNotificacionesSchema;
