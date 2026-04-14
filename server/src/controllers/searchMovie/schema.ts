import * as z from "zod";

export const SearchMovieRequestSchema = z
  .object({
    title: z.preprocess((value) => {
      if (typeof value === "string") {
        const normalizedValue = value.trim();

        return normalizedValue.length > 0 ? normalizedValue : undefined;
      }

      if (Array.isArray(value) && typeof value[0] === "string") {
        const normalizedValue = value[0].trim();

        return normalizedValue.length > 0 ? normalizedValue : undefined;
      }

      return undefined;
    }, z.string().trim().min(1).optional()),
    genres: z.preprocess(
      (value) => {
        if (typeof value === "string") {
          const genres = value
            .split(",")
            .map((genre) => genre.trim())
            .filter(Boolean);

          return genres.length > 0 ? genres : undefined;
        }

        if (Array.isArray(value)) {
          const genres = value
            .flatMap((item) =>
              typeof item === "string" ? item.split(",") : [],
            )
            .map((genre) => genre.trim())
            .filter(Boolean);

          return genres.length > 0 ? genres : undefined;
        }

        return undefined;
      },
      z.array(z.string().min(1)).min(1).optional(),
    ),
    pagination: z.object({
      page: z.coerce.number().int().min(1),
      pageSize: z.coerce.number().int().min(1),
    }),
  })
  .refine((value) => Boolean(value.title || value.genres?.length), {
    message: "At least one filter must be provided",
  });

export type SearchMovieRequestDTO = z.infer<typeof SearchMovieRequestSchema>;
