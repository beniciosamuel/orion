import type { Knex } from "knex";
import * as databaseConfig from "../.env/secrets.json";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: databaseConfig.development.DB_HOST,
      user: databaseConfig.development.DB_USER,
      password: databaseConfig.development.DB_PASSWORD,
      database: databaseConfig.development.DB_NAME,
    },
  },
};

export default config;
