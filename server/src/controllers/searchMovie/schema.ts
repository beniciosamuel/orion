import * as z from "zod";

export const SearchMovieRequestSchema = z
  .object({
    title: z.preprocess((value) => {
      if (typeof value === "string") {
        return value;
      }

      if (Array.isArray(value) && typeof value[0] === "string") {
        return value[0];
      }

      return undefined;
    }, z.string().trim().min(1).optional()),
    genres: z.preprocess(
      (value) => {
        if (typeof value === "string") {
          return value
            .split(",")
            .map((genre) => genre.trim())
            .filter(Boolean);
        }

        if (Array.isArray(value)) {
          return value
            .flatMap((item) =>
              typeof item === "string" ? item.split(",") : [],
            )
            .map((genre) => genre.trim())
            .filter(Boolean);
        }

        return undefined;
      },
      z.array(z.string().min(1)).min(1).optional(),
    ),
    pagination: z.object({
      page: z.number().int().min(1),
      pageSize: z.number().int().min(1),
    }),
  })
  .refine((value) => Boolean(value.title || value.genres?.length), {
    message: "At least one filter must be provided",
  });

export type SearchMovieRequestDTO = z.infer<typeof SearchMovieRequestSchema>;
