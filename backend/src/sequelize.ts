import { Sequelize } from "sequelize-typescript";
import {SequelizeOptions} from "sequelize-typescript/dist/sequelize/sequelize/sequelize-options";

// This Database config is here as a minimal example, this config would be managed correctly
// ideally through AWS KMS or other appropriate secret management. LH 2023-02-14
const dbConfig: Record<string, SequelizeOptions> = {
  test: {
    dialect: "sqlite",
    storage: "test-database.sqlite",
  },
  development: { dialect: "sqlite", storage: "database.sqlite" },
  production: {
    dialect: "mysql",
    port: 25060,
    host: "db-mysql-lon1-81183-do-user-756390-0.b.db.ondigitalocean.com",
    database: "defaultdb",
    username: "doadmin",
    password: process.env.DATABASE_SECRET,
    ssl: true,
  },
};

export class SequelizeInstance {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    let dbConfigToUse = undefined;
    switch (process.env.NODE_ENV) {
      case "test":
        dbConfigToUse = dbConfig.test;
        break;
      case "production":
        dbConfigToUse = dbConfig.production;
        break;
      default:
        dbConfigToUse = dbConfig.development;
        break;
    }

    if (!SequelizeInstance.instance) {
      console.log("dbConfigToUse", dbConfigToUse)
      SequelizeInstance.instance = new Sequelize(dbConfigToUse);
    }
    return SequelizeInstance.instance;
  }
}
