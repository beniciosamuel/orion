"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const Secrets_1 = require("./services/Secrets");
class PrivateExpress {
    App = null;
    Server = null;
    constructor(args) {
        this.App = args.app;
        this.Server = args.server;
    }
    async init() {
        if (!this.App || !this.Server) {
            throw new Error("App and server must be provided");
        }
        this.App.use((0, cors_1.default)());
        this.App.use(express_1.default.json());
        this.App.use(express_1.default.urlencoded({ extended: true }));
        this.App.use((0, cors_1.default)({
            origin: true,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        const secretsService = new Secrets_1.Secrets();
        const serverPort = await secretsService.getServerPort();
        this.Server.listen(serverPort, () => {
            console.info(`Server is running on port ${serverPort}`);
        });
    }
}
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const privateExpress = new PrivateExpress({ app, server });
privateExpress.init().catch((error) => {
    console.error("Failed to initialize server", error);
    process.exit(1);
});
