import { createClient } from "redis";

export class Cache {
  static instance: ReturnType<typeof createClient> | null = null;
  static isConnected = false;

  static getInstance() {
    if (!Cache.instance) {
      Cache.instance = createClient({
        username: "default",
        password: "BNVK8aI7XNkBkNSzTqPPJv24huonxmBN",
        socket: {
          host: "redis-14681.c1.us-west-2-2.ec2.cloud.redislabs.com",
          port: 14681,
        },
      });
    } else {
      console.info(
        "Redis client instance already exists. Returning the existing instance.",
      );
    }
    return Cache.instance;
  }

  static async connect() {
    const instance = Cache.getInstance();

    instance.on("error", (err) => console.log("Redis Client Error", err));

    await instance.connect();
    Cache.isConnected = true;
  }

  static async set(key: string, value: string) {
    const instance = Cache.getInstance();
    await instance.set(key, value);
  }

  static async get(key: string): Promise<string | null> {
    const instance = Cache.getInstance();
    return await instance.get(key);
  }

  static async del(key: string) {
    const instance = Cache.getInstance();
    await instance.del(key);
  }

  static async disconnect() {
    const instance = Cache.getInstance();
    await instance.disconnect();
  }
}
