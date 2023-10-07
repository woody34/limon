import { AuthSchema } from "$modules/auth/entities/auth.entity.ts";
import z from "zod";

export const AuthDtoSchema = AuthSchema.pick({ _id: true });

export type AuthDto = z.infer<typeof AuthDtoSchema>;
