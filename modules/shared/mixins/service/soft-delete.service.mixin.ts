import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import invariant from "invariant";
import { Collection, Filter } from "mongo";
import { Mongo } from "../../entities/mongo.entity.ts";
import { Constructor } from "../constructor.type.ts";

export function SoftDeleteMixinFactory<
  ENTITY extends Mongo,
  COL extends Collection<ENTITY>,
>(Collection: COL) {
  return function SoftDeleteServiceMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class SoftDelete extends Base {
      public static async softDelete(id: ObjectId): Promise<boolean> {
        invariant(
          ObjectId.isValid(id),
          `Unable to soft delete ${Collection.name}, invalid id "${
            String(id)
          }"`,
        );
        const filter = { _id: new ObjectId(id) } as Filter<ENTITY>;
        const partial = { inactive: true } as Partial<ENTITY>;
        const result = await Collection.updateOne(filter, partial);
        return result.matchedCount === 1 && result.modifiedCount === 1;
      }
    };
  };
}
