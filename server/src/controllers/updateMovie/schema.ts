import * as z from "zod";

import { CreateMovieRequestSchema } from "../createMovie/schema";

export const UpdateMovieRequestSchema = CreateMovieRequestSchema.extend({
  id: z.uuid(),
});

export type UpdateMovieRequestDTO = z.infer<typeof UpdateMovieRequestSchema>;
