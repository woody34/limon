import { UserDtoSchema } from "$modules/user/dtos/user.dto.ts";
import z from "zod";

export const UserPartialDtoSchema = UserDtoSchema.partial();

export type UserPartialDto = z.infer<typeof UserPartialDtoSchema>;
