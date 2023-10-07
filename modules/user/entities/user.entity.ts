import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import { z } from "zod";
import database from "../../database/mongo.client.ts";
import { MongoSchema } from "../../shared/entities/mongo.entity.ts";

export const UserSchema = MongoSchema.extend({
  _id: z.instanceof(ObjectId),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  orgName: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserCollection = database.collection<User>("user");
export const UserArchivesCollection = database.collection<User>(
  "user_archives",
);

// TODO: extract this into a helper, make it reusable
// export const userCollectionIndexes = new Map<string, Document>();
// userCollectionIndexes.set("Query User Index V1", {
//   _id: 1,
//   firstName: 1,
//   lastName: 1,
//   email: 1,
// });

// const existingIndices = await UserCollection.listIndexes().toArray();
// for (const [name, index] of userCollectionIndexes.entries()) {
//   const { name: _, ...indexWithoutName } = index;

//   const oldIndex = existingIndices.find(({ name: _, ...rest }) =>
//     isEqual(rest, indexWithoutName)
//   );

//   if (oldIndex != null) {
//     await UserCollection.dropIndexes({ index: oldIndex.name });
//   }

//   await UserCollection.createIndexes({
//     indexes: [{
//       name: name,
//       key: index,
//     }],
//   });
// }
