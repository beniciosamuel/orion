import * as z from "zod";

export const DeleteMovieRequestSchema = z.object({
  id: z.uuid(),
});

export type DeleteMovieRequestDTO = z.infer<typeof DeleteMovieRequestSchema>;
