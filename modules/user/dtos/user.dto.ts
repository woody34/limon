import { MongoIdDtoSchema } from "$modules/shared/dtos/mongo-id.dto.ts";
import z from "zod";
import { MongoOmissionWithId } from "../../shared/entities/mongo.entity.ts";
import { UserSchema } from "../entities/user.entity.ts";

export const UserDtoSchema = UserSchema.omit(MongoOmissionWithId).extend({
  _id: MongoIdDtoSchema,
});

export type UserDto = z.infer<typeof UserDtoSchema>;
