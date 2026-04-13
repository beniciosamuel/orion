import fs from "fs";
import path from "path";

const SECRETS_DIR = path.join(process.cwd(), ".env");

export class Secrets {
  private env: "development" | "production" =
    process.env.NODE_ENV === "production" ? "production" : "development";

  async setEnv(env: "development" | "production"): Promise<void> {
    if (this.env === "development") {
      this.env = env;
    }
  }

  private async getSecrets(): Promise<Record<string, Record<string, string>>> {
    const secretsPath = path.join(SECRETS_DIR, "secrets.json");
    return JSON.parse(fs.readFileSync(secretsPath, "utf8"));
  }

  private async getEnvSecrets(): Promise<Record<string, string>> {
    const secrets = await this.getSecrets();
    return secrets[this.env] || {};
  }

  async getString(key: string): Promise<string> {
    try {
      const secrets = await this.getSecrets();

      const nodes = secrets[this.env] || {};
      const secret = nodes[key];

      if (!secret) {
        throw new Error(`Secret ${key} not found`);
      }
      return secret;
    } catch (error) {
      throw new Error(`Failed to get secret ${key}: ${error}`, {
        cause: error,
      });
    }
  }

  async getServerPort(): Promise<number> {
    const portStr = await this.getString("SERVER_PORT").catch(() => "3000");
    return parseInt(portStr, 10) || 3000;
  }

  async getDatabaseConfig(): Promise<{
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionString?: string;
  }> {
    const secrets = await this.getEnvSecrets();

    return {
      host: secrets.DB_HOST || "127.0.0.1",
      port: parseInt(secrets.DB_PORT ?? "5432", 10) || 5432,
      user: secrets.DB_USER || "postgres",
      password: secrets.DB_PASSWORD || "postgres",
      database: secrets.DB_NAME || "baymax",
      ...(secrets.DATABASE_URL && { connectionString: secrets.DATABASE_URL }),
    };
  }

  async getRedisConfig(): Promise<{
    host: string;
    port: number;
    username?: string;
    password?: string;
  }> {
    const secrets = await this.getEnvSecrets();

    return {
      host: secrets.REDIS_HOST || "127.0.0.1",
      port: parseInt(secrets.REDIS_PORT ?? "6379", 10) || 6379,
      username: secrets.REDIS_USERNAME || "",
      password: secrets.REDIS_PASSWORD || "",
    };
  }

  async getGCSBucketName(): Promise<string> {
    const bucketName = await this.getString("GCS_BUCKET_NAME").catch(() => {
      throw new Error("GCS_BUCKET_NAME secret is required");
    });

    return `https://storage.googleapis.com/${bucketName}`;
  }
}
