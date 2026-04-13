import { Storage } from "@google-cloud/storage";

export class StorageService {
  private static instance: Storage;

  static getInstance(): Storage {
    if (!StorageService.instance) {
      StorageService.instance = new Storage();
    }
    return StorageService.instance;
  }

  static async uploadFile(args: {
    bucketName: string;
    filePath: string;
    destination: string;
  }): Promise<boolean> {
    const storage = StorageService.getInstance();

    await storage.bucket(args.bucketName).upload(args.filePath, {
      destination: args.destination,
    });
    return true;
  }
}
