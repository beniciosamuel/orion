import * as z from "zod";

export const SetMovieVoteRequestSchema = z.object({
  movieId: z.uuid(),
  rating: z.number().int().min(1).max(5),
});

export type SetMovieVoteRequestDTO = z.infer<typeof SetMovieVoteRequestSchema>;
