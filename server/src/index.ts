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
import { UpdateMovieController } from "./controllers/updateMovie";
import { DeleteMovieController } from "./controllers/deleteMovie";
import { NotifyReleasesQueue } from "./queues/notifyReleases";
import { CreateUserController } from "./controllers/createUser";
import { CreateUserCodeController } from "./controllers/createUserCode";
import { CreateMovieController } from "./controllers/createMovie";
import { AuthenticateController } from "./controllers/authenticate";
import { SendUserCodeQueue } from "./queues/sendUserCode";
import { UpdateUserPasswordController } from "./controllers/updateUserPassword";
import { GetReleasedMoviesCronJob } from "./cronjobs/getReleasedMovies";

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
    this.App.post("/createUserCode", CreateUserCodeController.handler);
    this.App.post("/updateUserPassword", UpdateUserPasswordController.handler);
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
    this.App.post("/movies/updateMovie", UpdateMovieController.handler);
    this.App.post("/movies/deleteMovie", DeleteMovieController.handler);
    this.App.post("/movies/setMovieVote", SetMovieVoteController.handler);
    this.App.post("/updateUserTheme", UpdateUserThemeController.handler);
    this.App.post("/cronjobs/getReleasedMovies", async (_req, res, next) => {
      try {
        await GetReleasedMoviesCronJob.execute();
        res.status(202).json({ message: "Cron job executed" });
      } catch (error) {
        next(error);
      }
    });

    MessageBroker.subscribe("notifyReleases", NotifyReleasesQueue.handler);
    MessageBroker.subscribe("createUserCode", SendUserCodeQueue.handler);

    const secretsService = new Secrets();

    const envPort = Number(process.env.PORT);
    const serverPort =
      Number.isFinite(envPort) && envPort > 0
        ? envPort
        : await secretsService.getServerPort();

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
