import { MongoSchemaCreate } from "$modules/shared/entities/mongo.entity.ts";
import z from "zod";

export const AuthCreateDtoSchema = MongoSchemaCreate.extend({
  email: z.string().email().trim().toLowerCase(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

export type AuthCreateDto = z.infer<typeof AuthCreateDtoSchema>;
