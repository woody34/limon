import { AuthCreateDtoSchema } from "$modules/auth/dtos/auth-create.dto.ts";
import z from "zod";

export const AuthLoginDtoSchema = AuthCreateDtoSchema.pick({
  email: true,
  password: true,
});

export type AuthLoginDto = z.infer<typeof AuthLoginDtoSchema>;
