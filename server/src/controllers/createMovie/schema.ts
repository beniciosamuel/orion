import * as z from "zod";

export const CreateMovieRequestSchema = z.object({
  resumeTitle: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  userComment: z.string().nullable().optional(),
  director: z.string().min(1),
  duration: z.number().positive(),
  genres: z.string().min(1),
  language: z.string().min(1),
  ageRating: z.string().min(1),
  budget: z.string().nullable().optional(),
  revenue: z.string().nullable().optional(),
  profit: z.string().nullable().optional(),
  productionCompany: z.string().nullable().optional(),
  trailerUrl: z.string().nullable().optional(),
  releaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export type CreateMovieRequestDTO = z.infer<typeof CreateMovieRequestSchema>;
