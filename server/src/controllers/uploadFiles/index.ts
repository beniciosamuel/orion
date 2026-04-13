import { Request, Response } from "express";

import { UploadFileRequestSchema } from "./schema";
import { Context } from "../../services/Context";
import { FileUseCase } from "../../models/File/FileUseCase";

export class UploadFileController {
  static async handler(req: Request, res: Response) {
    try {
      const context = req.context ?? (await Context.initialize());

      const dataRequestParsed = UploadFileRequestSchema.parse(req.body);
      const files = req.files as {
        [fieldname: string]: {
          mimetype: string;
          buffer: Buffer;
        }[];
      };

      const poster = files?.poster?.[0];
      const backdrop = files?.backdrop?.[0];

      if (!poster || !backdrop) {
        return res.status(400).json({
          error: "Both poster and backdrop files are required",
        });
      }

      const posterUri = await context.storage.uploadFile(
        poster,
        context.storage.generateFileName(),
        context,
      );

      const backdropUri = await context.storage.uploadFile(
        backdrop,
        context.storage.generateFileName(),
        context,
      );

      await FileUseCase.create(
        {
          ...dataRequestParsed.poster,
          uri: posterUri || "",
          isPoster: true,
          isCover: false,
        },
        dataRequestParsed.movieId,
        context,
      );

      await FileUseCase.create(
        {
          ...dataRequestParsed.backdrop,
          uri: backdropUri || "",
          isPoster: false,
          isCover: true,
        },
        dataRequestParsed.movieId,
        context,
      );

      res.status(201).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
}
