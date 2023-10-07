import { Roles } from "$modules/shared/constants/roles.enum.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import { z } from "zod";
import database from "../../database/mongo.client.ts";
import { MongoSchema } from "../../shared/entities/mongo.entity.ts";

export const AuthSchema = MongoSchema.extend({
  _id: z.instanceof(ObjectId),
  email: z.string().email(),
  hash: z.string(),
  role: z.number().default(Roles.None),
});

export type Auth = z.infer<typeof AuthSchema>;

export const AuthCollection = database.collection<Auth>("auth");

// TODO: Add index on email address.
