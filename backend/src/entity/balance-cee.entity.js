"use strict";
import { EntitySchema } from "typeorm";

const BalanceCEESchema = new EntitySchema({
  name: "BalanceCEE",
  tableName: "balance_cee",
  columns: {
    idBalanceCEE: {
      name: "id_balance_cee",
      type: "bigint",
      primary: true,  
      generated: true,
    },
    periodo: {
      name: "periodo",
      type: "varchar",
      length: 10,
      nullable: true,
    },
    montoActual: {
      name: "monto_actual",
      type: "int",
      nullable: false,
    },
    totalIngresos: {
      name: "total_ingresos",
      type: "int",
      nullable: false,
    },
    totalSalidas: {
      name: "total_salidas",
      type: "int",
      nullable: false,  
    },
    ingresoFullBalance: {
      name: "ingreso_full_balance",
      type: "int",
      nullable: true, // Puede ser nulo
    }
  },

});

export default BalanceCEESchema; 