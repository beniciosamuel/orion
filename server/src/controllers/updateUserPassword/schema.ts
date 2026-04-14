import * as z from "zod";

export const updateUserPasswordSchema = z.object({
  userId: z.uuid(),
  code: z.string().min(1, "Code is required"),
  newPassword: z.string().min(8).max(20),
});

export type UpdateUserPasswordDTO = z.infer<typeof updateUserPasswordSchema>;
