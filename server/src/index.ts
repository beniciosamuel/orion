import express from "express";
import { createServer } from "http";
import cors from "cors";

import { Secrets } from "./services/Secrets";

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
