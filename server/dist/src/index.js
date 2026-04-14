"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const Secrets_1 = require("./services/Secrets");
const MessageBroker_1 = require("./services/MessageBroker");
const AuthContextMiddleware_1 = require("./middlewares/AuthContextMiddleware");
const uploadFiles_1 = require("./controllers/uploadFiles");
const searchMovie_1 = require("./controllers/searchMovie");
const getMovieById_1 = require("./controllers/getMovieById");
const listMovies_1 = require("./controllers/listMovies");
const setMovieVote_1 = require("./controllers/setMovieVote");
const updateUserTheme_1 = require("./controllers/updateUserTheme");
const notifyReleases_1 = require("./queues/notifyReleases");
const createUser_1 = require("./controllers/createUser");
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
        this.App.use(AuthContextMiddleware_1.AuthContextMiddleware.handler);
        const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
        this.App.get("uploadFiles", upload.fields([
            { name: "poster", maxCount: 1 },
            { name: "backdrop", maxCount: 1 },
        ]), uploadFiles_1.UploadFileController.handler);
        this.App.post("/createUser", createUser_1.CreateUserController.handler);
        this.App.post("/movies/search", searchMovie_1.SearchMovieController.handler);
        this.App.post("/movies/list", listMovies_1.ListMoviesController.handler);
        this.App.post("/movies/getById", getMovieById_1.GetMovieByIdController.handler);
        this.App.post("/movies/setMovieVote", setMovieVote_1.SetMovieVoteController.handler);
        this.App.post("/users/updateTheme", updateUserTheme_1.UpdateUserThemeController.handler);
        MessageBroker_1.MessageBroker.subscribe("notifyReleases", notifyReleases_1.NotifyReleasesQueue.handler);
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
