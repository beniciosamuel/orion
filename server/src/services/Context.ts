import type { Knex } from "knex";

import { Secrets } from "./Secrets";
import { Cache } from "./Cache";
import { MessageBroker } from "./MessageBroker";
import { DatabaseService } from "./Database";
import { Password } from "./Password";
import { StorageService } from "./Storage";
import { UserEntity } from "../models/User/UserEntity";

type CacheClient = NonNullable<Awaited<ReturnType<typeof Cache.getInstance>>>;

export class Context {
  public secrets: Secrets;
  public cache: CacheClient;
  public messageBroker: MessageBroker;
  public database: Knex;
  public password: Password;
  public storage: StorageService;
  public models: {
    user: UserEntity | null;
  };

  constructor(args: {
    secrets: Secrets;
    cache: CacheClient;
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
    this.models = {
      user: null,
    };
  }

  static async initialize(): Promise<Context> {
    const secrets = new Secrets();
    const cache = await Cache.getInstance(secrets);
    if (!Cache.isConnected) {
      await Cache.connect(secrets);
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
