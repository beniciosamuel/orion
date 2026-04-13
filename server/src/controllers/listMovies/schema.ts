import * as z from "zod";

export const ListMoviesRequestSchema = z.object({
  pagination: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
  }),
});

export type ListMoviesRequestDTO = z.infer<typeof ListMoviesRequestSchema>;
