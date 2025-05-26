"use strict";
import { EntitySchema } from "typeorm";

const MetaFinancieraSchema = new EntitySchema({
  name: "MetaFinanciera",
  tableName: "meta_financiera",
  columns: {
    idMetaFinanciera: {
      name: "id_meta_financiera",
      type: "bigint",
      primary: true,
      generated: true,
    },
    metaFinanciera: {
      name: "meta_financiera",
      type: "int",
      nullable: false,
    },
    periodo: {           
      name: "periodo",
      type: "varchar",
      length: 10,
      nullable: false,
    },
    descripcionMeta: {
      name: "descripcion_meta",
      type: "varchar",
      length: 50,
      nullable: false,
    },

    porcentajeCrecimiento: {
      name: "porcentaje_crecimiento",
      type: "int",
      nullable: false,
    }
  }
});

export default MetaFinancieraSchema; 