import express from "express";
import { createServer } from "http";
import cors from "cors";
import multer from "multer";

import { Secrets } from "./services/Secrets";
import { MessageBroker } from "./services/MessageBroker";

import { AuthContextMiddleware } from "./middlewares/AuthContextMiddleware";
import { UploadFileController } from "./controllers/uploadFiles";
import { SearchMovieController } from "./controllers/searchMovie";
import { GetMovieByIdController } from "./controllers/getMovieById";
import { ListMoviesController } from "./controllers/listMovies";
import { SetMovieVoteController } from "./controllers/setMovieVote";
import { UpdateUserThemeController } from "./controllers/updateUserTheme";
import { NotifyReleasesQueue } from "./queues/notifyReleases";
import { CreateUserController } from "./controllers/createUser";
import { CreateMovieController } from "./controllers/createMovie";
import { AuthenticateController } from "./controllers/authenticate";

class PrivateExpress {
  private App: express.Application | null = null;
  private Server: ReturnType<typeof createServer> | null = null;

  constructor(args: {
    app: express.Application;
    server: ReturnType<typeof createServer>;
  }) {
    this.App = args.app;
    this.Server = args.server;
  }

  public async init() {
    if (!this.App || !this.Server) {
      throw new Error("App and server must be provided");
    }

    this.App.use(cors());
    this.App.use(express.json());
    this.App.use(express.urlencoded({ extended: true }));

    this.App.use(
      cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    this.App.use(AuthContextMiddleware.handler);

    const upload = multer({ storage: multer.memoryStorage() });

    this.App.post("/authenticate", AuthenticateController.handler);
    this.App.post("/createUser", CreateUserController.handler);
    this.App.post("/createMovie", CreateMovieController.handler);
    this.App.post(
      "/uploadFiles",
      upload.fields([
        { name: "poster", maxCount: 1 },
        { name: "backdrop", maxCount: 1 },
      ]),
      UploadFileController.handler,
    );
    this.App.get("/movies/search", SearchMovieController.handler);
    this.App.get("/movies/list", ListMoviesController.handler);
    this.App.get("/movies/getById", GetMovieByIdController.handler);
    this.App.post("/movies/setMovieVote", SetMovieVoteController.handler);
    this.App.post("/updateUserTheme", UpdateUserThemeController.handler);

    MessageBroker.subscribe("notifyReleases", NotifyReleasesQueue.handler);

    const secretsService = new Secrets();

    const serverPort = await secretsService.getServerPort();

    this.Server.listen(serverPort, () => {
      console.info(`Server is running on port ${serverPort}`);
    });
  }
}

const app = express();
const server = createServer(app);

const privateExpress = new PrivateExpress({ app, server });

privateExpress.init().catch((error: unknown) => {
  console.error("Failed to initialize server", error);
  process.exit(1);
});
