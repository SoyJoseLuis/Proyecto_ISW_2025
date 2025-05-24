"use strict";
import { EntitySchema } from "typeorm";

const TipoTransaccionSchema = new EntitySchema({
  name: "TipoTransaccion",
  tableName: "tipo_transaccion",
  columns: {
    idTipoTransaccion: {
      name: "id_tipo_transaccion",
      type: "bigint",
      primary: true,
      generated: true,
    },
    descripcionTransaccion: {
      name: "descripcion_transaccion",
      type: "varchar",
      length: 20,
      nullable: false,
    }
  },
  relations: {
    transacciones: {
      type: "one-to-many",
      target: "Transaccion",
      inverseSide: "tipoTransaccion"
    }
  }
});

export default TipoTransaccionSchema; 