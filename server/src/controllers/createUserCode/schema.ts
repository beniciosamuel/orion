import * as z from "zod";

export const createUserCodeSchema = z
  .object({
    userId: z.uuid().optional(),
    email: z.email().optional(),
  })
  .refine((data) => Boolean(data.userId || data.email), {
    message: "User ID or email is required",
    path: ["email"],
  });

export type CreateUserCodeDTO = z.infer<typeof createUserCodeSchema>;
