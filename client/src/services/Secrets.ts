const SECRETS_PATH = "/.env/secrets.json";

export class Secrets {
  private env: "development" | "production";
  private secretsCache: Record<string, Record<string, string>> | null = null;

  constructor() {
    this.env =
      process.env.NODE_ENV === "production" ? "production" : "development";
  }

  setEnv(env: "development" | "production"): void {
    if (this.env === "development") {
      this.env = env;
    }
  }

  private async getSecrets(): Promise<Record<string, Record<string, string>>> {
    if (this.secretsCache) {
      return this.secretsCache;
    }

    try {
      const response = await fetch(SECRETS_PATH);
      if (!response.ok) {
        throw new Error(`Failed to fetch secrets: ${response.statusText}`);
      }
      this.secretsCache = await response.json();
      return this.secretsCache!;
    } catch (error) {
      console.error(`Error loading secrets: ${error}`);
      throw new Error(`Failed to load secrets: ${error}`);
    }
  }

  async getString(key: string): Promise<string> {
    try {
      const secrets = await this.getSecrets();
      const secret = secrets[this.env][key];
      if (!secret && secret !== "") {
        throw new Error(`Secret ${key} not found`);
      }
      return secret;
    } catch (error) {
      console.error(`Error getting secret ${key}: ${error}`);
      throw new Error(`Failed to get secret ${key}: ${error}`);
    }
  }

  async getApiUrl(): Promise<string> {
    try {
      const SERVER_HOST = await this.getString("SERVER_HOST");
      const SERVER_PORT = await this.getString("SERVER_PORT");

      return this.env === "production"
        ? SERVER_HOST
        : `http://${SERVER_HOST}:${SERVER_PORT}`;
    } catch {
      console.warn(
        "Failed to load API URL from secrets, falling back to default localhost URL",
      );
      return "http://127.0.0.1:5000";
    }
  }

  getEnv(): "development" | "production" {
    return this.env;
  }

  isDevelopment(): boolean {
    return this.env === "development";
  }

  isProduction(): boolean {
    return this.env === "production";
  }
}

export const secrets = new Secrets();
