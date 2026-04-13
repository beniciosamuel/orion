import * as z from "zod";

export const CreateUserRequestSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  scope: z.enum(["viewer", "editor", "admin"]).default("viewer"),
});

export type CreateUserRequestDTO = z.infer<typeof CreateUserRequestSchema>;
