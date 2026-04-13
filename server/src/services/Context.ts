import type { Knex } from "knex";

import { Secrets } from "./Secrets";
import { Cache } from "./Cache";
import { MessageBroker } from "./MessageBroker";
import { DatabaseService } from "./Database";
import { Password } from "./Password";
import { StorageService } from "./Storage";

export class Context {
  public secrets: Secrets;
  public cache: Cache;
  public messageBroker: MessageBroker;
  public database: Knex;
  public password: Password;
  public storage: StorageService;

  constructor(args: {
    secrets: Secrets;
    cache: Cache;
    messageBroker: MessageBroker;
    database: Knex;
    password: Password;
    storage: StorageService;
  }) {
    this.secrets = args.secrets || new Secrets();
    this.cache = args.cache;
    this.messageBroker = args.messageBroker;
    this.database = args.database;
    this.password = args.password;
    this.storage = args.storage;
  }

  static async initialize(): Promise<Context> {
    const secrets = new Secrets();
    const cache = Cache.getInstance();
    if (!Cache.isConnected) {
      await Cache.connect();
    }
    const messageBroker = MessageBroker.getInstance();
    const database = DatabaseService.getInstance();
    const password = new Password();
    const storage = new StorageService();

    return new Context({
      secrets,
      cache,
      messageBroker,
      database: await database.connect(),
      password,
      storage,
    });
  }
}
