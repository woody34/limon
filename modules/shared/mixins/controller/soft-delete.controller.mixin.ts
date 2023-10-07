import { Handler, Status } from "$fresh/server.ts";
import { MongoIdDtoSchema } from "$modules/shared/dtos/mongo-id.dto.ts";
import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import { ObjectId } from "mongo";
import { Constructor } from "../constructor.type.ts";

export function SoftDeleteControllerMixinFactory<
  SERVICE extends {
    softDelete: (id: ObjectId) => Promise<boolean>;
  },
>(Service: SERVICE) {
  return function SoftDeleteControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class SoftDeleteController extends Base {
      public static softDelete: Handler<boolean> = async (_req, ctx) => {
        const { success } = MongoIdDtoSchema.safeParse(ctx.params.id);

        httpInvariant(
          success,
          `Invalid id: "${ctx.params.id}".`,
          Status.BadRequest,
        );

        const id = MongoIdDtoSchema.parse(ctx.params.id);
        const result = await Service.softDelete(new ObjectId(id));

        httpInvariant(
          result,
          `Soft delete of id: "${id}" failed.`,
          Status.NotFound,
        );

        return new Response(JSON.stringify(result));
      };
    };
  };
}
