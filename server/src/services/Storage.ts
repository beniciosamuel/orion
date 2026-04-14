import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

import { Context } from "./Context";
export class StorageService {
  private static instance: Storage;

  public generateFileName(): string {
    return uuidv4();
  }

  static getInstance(): Storage {
    return new Storage();
  }

  async uploadFile(
    file: {
      mimetype: string;
      buffer: Buffer;
    },
    fileName: string,
    context: Context,
  ): Promise<string> {
    const storage = StorageService.getInstance();
    const bucketName = await context.secrets.getGCSBucketName();

    const blob = storage.bucket(bucketName).file(fileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    await new Promise<void>((resolve, reject) => {
      blobStream.on("error", (err) => {
        console.error("Error uploading file to GCS:", err);
        reject(err);
      });

      blobStream.on("finish", () => {
        resolve();
      });

      blobStream.end(file.buffer);
    });

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  }
}
