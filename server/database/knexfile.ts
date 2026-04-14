import type { Knex } from "knex";
import fs from "node:fs";
import path from "node:path";

type DbEnvConfig = {
  DB_HOST?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
};

type SecretsShape = {
  development?: DbEnvConfig;
};

function getDevelopmentDatabaseConfig(): Required<DbEnvConfig> {
  const secretsPath = path.join(process.cwd(), ".env", "secrets.json");

  if (!fs.existsSync(secretsPath)) {
    return {
      DB_HOST: "127.0.0.1",
      DB_USER: "postgres",
      DB_PASSWORD: "postgres",
      DB_NAME: "baymax",
    };
  }

  const parsed = JSON.parse(
    fs.readFileSync(secretsPath, "utf8"),
  ) as SecretsShape;
  const development = parsed.development ?? {};

  return {
    DB_HOST: development.DB_HOST ?? "127.0.0.1",
    DB_USER: development.DB_USER ?? "postgres",
    DB_PASSWORD: development.DB_PASSWORD ?? "postgres",
    DB_NAME: development.DB_NAME ?? "baymax",
  };
}

const developmentDatabaseConfig = getDevelopmentDatabaseConfig();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: developmentDatabaseConfig.DB_HOST,
      user: developmentDatabaseConfig.DB_USER,
      password: developmentDatabaseConfig.DB_PASSWORD,
      database: developmentDatabaseConfig.DB_NAME,
    },
  },
};

export default config;
