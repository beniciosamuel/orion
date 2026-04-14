"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = exports.DatabaseConnectionError = void 0;
const knex_1 = __importDefault(require("knex"));
const Secrets_js_1 = require("./Secrets.js");
class DatabaseConnectionError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "DatabaseConnectionError";
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
class DatabaseService {
    static instance;
    knexInstance = null;
    isConnected = false;
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    async getConfig() {
        const secrets = new Secrets_js_1.Secrets();
        return secrets.getDatabaseConfig();
    }
    createKnexConfig(config) {
        const useSsl = !!config.connectionString ||
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
            connection: connection,
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
    async connect() {
        console.log("Connecting to the database...");
        if (this.knexInstance && this.isConnected) {
            return this.knexInstance;
        }
        try {
            const config = await this.getConfig();
            const hasConnectionString = !!config.connectionString?.trim();
            const hasIndividual = !!(config.host?.trim() &&
                config.user?.trim() &&
                config.database?.trim());
            if (!hasConnectionString && !hasIndividual) {
                throw new DatabaseConnectionError("Missing database config. Set DATABASE_URL (e.g. Neon) or DB_HOST, DB_USER, DB_NAME.");
            }
            const knexConfig = this.createKnexConfig(config);
            this.knexInstance = (0, knex_1.default)(knexConfig);
            console.log("Testing database connection...");
            await this.knexInstance.raw("SELECT 1");
            console.log("Database connection verified");
            this.isConnected = true;
            console.log(hasConnectionString
                ? `Database connected successfully (connection string)`
                : `Database connected successfully to ${config.host}:${config.port}/${config.database}`);
            return this.knexInstance;
        }
        catch (error) {
            this.isConnected = false;
            this.knexInstance = null;
            if (error instanceof DatabaseConnectionError) {
                throw error;
            }
            throw new DatabaseConnectionError("Failed to connect to the database", error instanceof Error ? error : new Error(String(error)));
        }
    }
    getKnex() {
        if (!this.knexInstance || !this.isConnected) {
            throw new DatabaseConnectionError("Database not connected. Call connect() first.");
        }
        return this.knexInstance;
    }
    isReady() {
        return this.isConnected && this.knexInstance !== null;
    }
    async disconnect() {
        if (this.knexInstance) {
            await this.knexInstance.destroy();
            this.knexInstance = null;
            this.isConnected = false;
            console.log("Database connection closed");
        }
    }
    async healthCheck() {
        if (!this.knexInstance) {
            return false;
        }
        try {
            await this.knexInstance.raw("SELECT 1");
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.DatabaseService = DatabaseService;
