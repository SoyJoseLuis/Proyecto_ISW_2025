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

      type: "one-to-many",
      target: "PanelNotificaciones",
      inverseSide: "notificacion"
    }
  }
});

export default NotificacionSchema;
