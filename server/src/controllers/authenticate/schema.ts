import * as z from "zod";

export const AuthenticateRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type AuthenticateRequestDTO = z.infer<typeof AuthenticateRequestSchema>;
