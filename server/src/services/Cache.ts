import { createClient } from "redis";

import { Secrets } from "./Secrets";

export class Cache {
  static instance: ReturnType<typeof createClient> | null = null;
  static isConnected = false;

  static async getInstance(secrets = new Secrets()) {
    if (!Cache.instance) {
      const redisConfig = await secrets.getRedisConfig();

      Cache.instance = createClient({
        username: redisConfig.username,
        password: redisConfig.password,
        socket: {
          host: redisConfig.host,
          port: redisConfig.port,
        },
      });
    } else {
      console.info(
        "Redis client instance already exists. Returning the existing instance.",
      );
    }
    return Cache.instance;
  }

  static async connect(secrets?: Secrets) {
    const instance = await Cache.getInstance(secrets);

    instance.on("error", (err) => console.log("Redis Client Error", err));

    await instance.connect();
    Cache.isConnected = true;
  }

  static async set(key: string, value: string) {
    const instance = await Cache.getInstance();
    await instance.set(key, value);
  }

  static async get(key: string): Promise<string | null> {
    const instance = await Cache.getInstance();
    return await instance.get(key);
  }

  static async del(key: string) {
    const instance = await Cache.getInstance();
    await instance.del(key);
  }

  static async delByPattern(pattern: string) {
    const instance = await Cache.getInstance();

    for await (const key of instance.scanIterator({ MATCH: pattern })) {
      await instance.del(key);
    }
  }

  static async disconnect() {
    const instance = await Cache.getInstance();
    await instance.disconnect();
  }
}
