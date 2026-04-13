import knex from "knex";
import type { Knex } from "knex";
import { Secrets } from "./Secrets.js";

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionString?: string;
}

export class DatabaseConnectionError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

export class DatabaseService {
  private static instance: DatabaseService;
  private knexInstance: Knex | null = null;
  private isConnected = false;

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async getConfig(): Promise<DatabaseConfig> {
    const secrets = new Secrets();
    return secrets.getDatabaseConfig();
  }

  private createKnexConfig(config: DatabaseConfig): Knex.Config {
    const useSsl =
      !!config.connectionString ||
      (config.host && !["localhost", "127.0.0.1"].includes(config.host));

    const connection = config.connectionString
      ? {
          connectionString: config.connectionString,
          ssl: useSsl ? { rejectUnauthorized: false } : undefined,
        }
      : {
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
          ssl: useSsl ? { rejectUnauthorized: false } : undefined,
        };

    console.log("Database connection configuration:", {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database,
      connectionString: config.connectionString ? "****" : undefined,
      ssl: useSsl,
    });

    return {
      client: "pg",
      connection: connection as Knex.ConnectionConfig,
      pool: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 20000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
      acquireConnectionTimeout: 10000,
    };
  }

  public async connect(): Promise<Knex> {
    console.log("Connecting to the database...");
    if (this.knexInstance && this.isConnected) {
      return this.knexInstance;
    }

    try {
      const config = await this.getConfig();

      const hasConnectionString = !!config.connectionString?.trim();
      const hasIndividual = !!(
        config.host?.trim() &&
        config.user?.trim() &&
        config.database?.trim()
      );

      if (!hasConnectionString && !hasIndividual) {
        throw new DatabaseConnectionError(
          "Missing database config. Set DATABASE_URL (e.g. Neon) or DB_HOST, DB_USER, DB_NAME.",
        );
      }

      const knexConfig = this.createKnexConfig(config);
      this.knexInstance = knex(knexConfig);

      console.log("Testing database connection...");

      await this.knexInstance.raw("SELECT 1");
      console.log("Database connection verified");
      this.isConnected = true;

      console.log(
        hasConnectionString
          ? `Database connected successfully (connection string)`
          : `Database connected successfully to ${config.host}:${config.port}/${config.database}`,
      );

      return this.knexInstance;
    } catch (error) {
      this.isConnected = false;
      this.knexInstance = null;

      if (error instanceof DatabaseConnectionError) {
        throw error;
      }

      throw new DatabaseConnectionError(
        "Failed to connect to the database",
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  public getKnex(): Knex {
    if (!this.knexInstance || !this.isConnected) {
      throw new DatabaseConnectionError(
        "Database not connected. Call connect() first.",
      );
    }
    return this.knexInstance;
  }

  public isReady(): boolean {
    return this.isConnected && this.knexInstance !== null;
  }

  public async disconnect(): Promise<void> {
    if (this.knexInstance) {
      await this.knexInstance.destroy();
      this.knexInstance = null;
      this.isConnected = false;

      console.log("Database connection closed");
    }
  }

  public async healthCheck(): Promise<boolean> {
    if (!this.knexInstance) {
      return false;
    }

    try {
      await this.knexInstance.raw("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }
}
