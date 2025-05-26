"use strict";
import { EntitySchema } from "typeorm";

const TransaccionSchema = new EntitySchema({
  name: "Transaccion",
  tableName: "transaccion",
  columns: {
    idTransaccion: {
      name: "id_transaccion",
      type: "bigint",
      primary: true,
      generated: true,
    },
    montoTransaccion: {
      name: "monto_transaccion",
      type: "int",
      nullable: false,
    },
    fechaTransaccion: {
      name: "fecha_transaccion",
      type: "varchar",
      length: 10,
      nullable: false,
    },
    rutEstudiante: {
      name: "rut_estudiante",
      type: "varchar",
      length: 12,
      nullable: false,
    },
    idTipoTransaccion: {
      name: "id_tipo_transaccion",
      type: "bigint",
      nullable: false,
    },
    motivoTransaccion: {
      name: "motivo_transaccion",
      type: "varchar",
      length: 30,
      nullable: false,
    },
    idActividad: {
      name: "id_actividad",
      type: "bigint",
      nullable: true,
    },
    idBalance: {
      name: "id_balance",
      type: "bigint",
      nullable: false,
    }
  },
  relations: {
    estudiante: {
      type: "many-to-one",
      target: "Estudiante",
      joinColumn: {
        name: "rut_estudiante",
      }
    },
    tipoTransaccion: {
      type: "many-to-one",
      target: "TipoTransaccion",
      joinColumn: {
        name: "id_tipo_transaccion",
      }
    },
    actividad: {
      type: "many-to-one",
      target: "Actividad",
      joinColumn: {
        name: "id_actividad",
      }
    },
    balance: {
      type: "many-to-one",
      target: "BalanceCEE",
      joinColumn: {
        name: "id_balance",
      }
    }
  }
});

export default TransaccionSchema; 