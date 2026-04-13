import * as z from "zod";

export const GetMovieByIdRequestSchema = z.object({
  id: z.uuid(),
});

export type GetMovieByIdRequestDTO = z.infer<typeof GetMovieByIdRequestSchema>;
