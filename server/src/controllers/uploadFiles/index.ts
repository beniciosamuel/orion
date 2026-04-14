import { Request, Response } from "express";

import { UploadFileRequestSchema } from "./schema";
import { Context } from "../../services/Context";
import { FileUseCase } from "../../models/File/FileUseCase";

export class UploadFileController {
  private static pickString(values: Array<unknown>, fallback: string): string {
    for (const value of values) {
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }

    return fallback;
  }

  private static pickWidth(values: Array<unknown>): number | null {
    for (const value of values) {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === "string" && value.trim().length > 0) {
        const parsed = Number(value);

        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return null;
  }

  static async handler(req: Request, res: Response) {
    try {
      const context = req.context ?? (await Context.initialize());

      console.log("Received file upload request with body:", req.body);

      const dataRequestParsed = UploadFileRequestSchema.parse(req.body);
      const body = req.body as Record<string, unknown>;

      const files = req.files as {
        [fieldname: string]: {
          mimetype: string;
          buffer: Buffer;
          originalname?: string;
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

      const posterOriginalName = UploadFileController.pickString(
        [
          dataRequestParsed.poster?.originalName,
          (body.poster as { originalName?: unknown } | undefined)?.originalName,
          body["poster[originalName]"],
          body.posterOriginalName,
        ],
        poster.originalname ?? "poster",
      );

      const posterFileName = UploadFileController.pickString(
        [
          dataRequestParsed.poster?.fileName,
          (body.poster as { fileName?: unknown } | undefined)?.fileName,
          body["poster[fileName]"],
          body.posterFileName,
        ],
        poster.originalname ?? posterOriginalName,
      );

      const posterWidth = UploadFileController.pickWidth([
        dataRequestParsed.poster?.width,
        (body.poster as { width?: unknown } | undefined)?.width,
        body["poster[width]"],
        body.posterWidth,
      ]);

      const backdropOriginalName = UploadFileController.pickString(
        [
          dataRequestParsed.backdrop?.originalName,
          (body.backdrop as { originalName?: unknown } | undefined)
            ?.originalName,
          body["backdrop[originalName]"],
          body.backdropOriginalName,
        ],
        backdrop.originalname ?? "backdrop",
      );

      const backdropFileName = UploadFileController.pickString(
        [
          dataRequestParsed.backdrop?.fileName,
          (body.backdrop as { fileName?: unknown } | undefined)?.fileName,
          body["backdrop[fileName]"],
          body.backdropFileName,
        ],
        backdrop.originalname ?? backdropOriginalName,
      );

      const backdropWidth = UploadFileController.pickWidth([
        dataRequestParsed.backdrop?.width,
        (body.backdrop as { width?: unknown } | undefined)?.width,
        body["backdrop[width]"],
        body.backdropWidth,
      ]);

      await FileUseCase.create(
        {
          originalName: posterOriginalName,
          fileName: posterFileName,
          width: posterWidth,
          movieId: dataRequestParsed.movieId,
          uri: posterUri || "",
          isPoster: true,
          isCover: false,
        },
        context,
      );

      await FileUseCase.create(
        {
          originalName: backdropOriginalName,
          fileName: backdropFileName,
          width: backdropWidth,
          movieId: dataRequestParsed.movieId,
          uri: backdropUri || "",
          isPoster: false,
          isCover: true,
        },
        context,
      );

      res.status(201).json({ message: "File uploaded successfully" });
    } catch (error) {
      const cause = error instanceof Error ? error.message : "Unknown error";

      console.error("Error handling file upload:", error);
      return res.status(500).json({ error: "Failed to upload file", cause });
    }
  }
}
