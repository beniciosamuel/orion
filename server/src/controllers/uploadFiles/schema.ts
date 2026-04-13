import * as z from "zod";

export const UploadFileRequestSchema = z.object({
  movieId: z.string().uuid(),
  poster: z.object({
    originalName: z.string(),
    fileName: z.string(),
    width: z.number().nullable().optional(),
  }),
  backdrop: z.object({
    originalName: z.string(),
    fileName: z.string(),
    width: z.number().nullable().optional(),
  }),
});
