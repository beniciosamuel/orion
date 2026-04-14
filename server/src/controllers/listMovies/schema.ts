import * as z from "zod";

export const ListMoviesRequestSchema = z.object({
  pagination: z.object({
    page: z.coerce.number().int().min(1),
    pageSize: z.coerce.number().int().min(1),
  }),
});

export type ListMoviesRequestDTO = z.infer<typeof ListMoviesRequestSchema>;
