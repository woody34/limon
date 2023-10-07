import { Handler, Status } from "$fresh/server.ts";
import { MongoIdDtoSchema } from "$modules/shared/dtos/mongo-id.dto.ts";
import { SafeParseJsonMixin } from "$modules/shared/mixins/utils/safe-parse-json.mixin.ts";
import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import { ObjectId } from "mongo";
import z, { ZodObject } from "zod";
import { Constructor } from "../constructor.type.ts";

export function FindByIdControllerMixinFactory<
  OUT extends ZodObject<any>,
  SERVICE extends {
    findById: (id: ObjectId) => Promise<z.infer<OUT> | undefined>;
  },
>(Service: SERVICE, OutSchema: OUT) {
  return function FindByIdControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class FindByIdController extends SafeParseJsonMixin(Base) {
      public static findById: Handler<any> = async (_req, ctx) => {
        const { success } = MongoIdDtoSchema.safeParse(ctx.params.id);

        httpInvariant(
          success,
          `Invalid id: "${ctx.params.id}".`,
          Status.BadRequest,
        );

        const id = MongoIdDtoSchema.parse(ctx.params.id);
        const result = await Service.findById(new ObjectId(id));

        httpInvariant(
          result != null,
          `Record with id: "${id}" was not found.`,
          Status.NotFound,
        );

        const parsed = OutSchema.parse(result);

        return new Response(JSON.stringify(parsed));
      };
    };
  };
}
