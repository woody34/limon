import {
  Mongo,
  MongoSchemaCreate,
} from "../../shared/entities/mongo.entity.ts";
import { User, UserSchema } from "../entities/user.entity.ts";

export const UserCreateDtoSchema = UserSchema.merge(MongoSchemaCreate).partial({
  _id: true,
});

export type UserCreateDto = Omit<User, keyof Mongo> & Partial<Mongo>;
