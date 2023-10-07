import { Handler, Status } from "$fresh/server.ts";
import { MongoIdDtoSchema } from "$modules/shared/dtos/mongo-id.dto.ts";
import { SafeParseJsonMixin } from "$modules/shared/mixins/utils/safe-parse-json.mixin.ts";
import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import { ObjectId } from "mongo";
import { ZodObject } from "zod";
import { Constructor } from "../constructor.type.ts";

export function UpdateControllerMixinFactory<
  IN extends ZodObject<any>,
  SERVICE extends {
    update: (id: ObjectId, data: any) => Promise<boolean>;
  },
>(Service: SERVICE, InSchema: IN) {
  return function UpdateControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class UpdateController extends SafeParseJsonMixin(Base) {
      public static update: Handler<{ success: boolean }> = async (
        req,
        ctx,
      ) => {
        const { success: successId } = MongoIdDtoSchema.safeParse(
          ctx.params.id,
        );
        httpInvariant(
          successId,
          `Invalid id: "${ctx.params.id}".`,
          Status.BadRequest,
        );
        const id = MongoIdDtoSchema.parse(ctx.params.id);

        const { data } = await this.safeParseJson(req);

        const { success: successBody } = InSchema.safeParse(data);
        httpInvariant(
          successBody,
          "Bad data shape.",
          Status.BadRequest,
        );

        const dto = InSchema.parse(data);

        const success = await Service.update(id, dto);
        return new Response(JSON.stringify({ success }));
      };
    };
  };
}
