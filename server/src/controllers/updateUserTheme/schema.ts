import * as z from "zod";

export const UpdateUserThemeRequestSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export type UpdateUserThemeRequestDTO = z.infer<
  typeof UpdateUserThemeRequestSchema
>;
