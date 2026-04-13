import * as z from "zod";

export const SetMovieVoteRequestSchema = z.object({
  movieId: z.uuid(),
  rating: z.number().int().min(0).max(100),
});

export type SetMovieVoteRequestDTO = z.infer<typeof SetMovieVoteRequestSchema>;
