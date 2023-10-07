import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { assert } from "https://deno.land/std@0.193.0/_util/asserts.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import { MongoIdDtoSchema } from "../../dtos/mongo-id.dto.ts";

Deno.test("Mongo Object Id Test.", async (t) => {
  await t.step(
    "Should transform a 24 character string object id into a valid mongo id.",
    () => {
      const input = "650cd7d7933fe52ecbf5a713";

      const output: ObjectId = MongoIdDtoSchema.parse(input);

      assert(ObjectId.isValid(output));
    },
  );

  await t.step(
    "Should transform a 24 character string object id into a matching mongo id.",
    () => {
      const input = "650cd7d7933fe52ecbf5a713";

      const output: ObjectId = MongoIdDtoSchema.parse(input);

      assert(output.equals(input));
    },
  );

  await t.step(
    "Should transform a 24 character string object id into a mongo id with correct derived creation timestamp.",
    () => {
      const input = "650cd7d7933fe52ecbf5a713";

      const output: ObjectId = MongoIdDtoSchema.parse(input);

      assertEquals(output.getTimestamp(), new Date(1695340503000));
    },
  );
});
