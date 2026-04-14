"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const Secrets_1 = require("./Secrets");
const Cache_1 = require("./Cache");
const MessageBroker_1 = require("./MessageBroker");
const Database_1 = require("./Database");
const Password_1 = require("./Password");
const Storage_1 = require("./Storage");
class Context {
    secrets;
    cache;
    messageBroker;
    database;
    password;
    storage;
    models;
    constructor(args) {
        this.secrets = args.secrets || new Secrets_1.Secrets();
        this.cache = args.cache;
        this.messageBroker = args.messageBroker;
        this.database = args.database;
        this.password = args.password;
        this.storage = args.storage;
        this.models = {
            user: null,
        };
    }
    static async initialize() {
        const secrets = new Secrets_1.Secrets();
        const cache = Cache_1.Cache.getInstance();
        if (!Cache_1.Cache.isConnected) {
            await Cache_1.Cache.connect();
        }
        const messageBroker = MessageBroker_1.MessageBroker.getInstance();
        const database = Database_1.DatabaseService.getInstance();
        const password = new Password_1.Password();
        const storage = new Storage_1.StorageService();
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
exports.Context = Context;
