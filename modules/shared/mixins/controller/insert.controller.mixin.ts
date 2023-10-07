import { Handler, Status } from "$fresh/server.ts";
import { SafeParseJsonMixin } from "$modules/shared/mixins/utils/safe-parse-json.mixin.ts";
import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import { ObjectId } from "mongo";
import z, { ZodObject } from "zod";
import { Constructor } from "../constructor.type.ts";

export function InsertControllerMixinFactory<
  IN extends ZodObject<any>,
  OUT extends ZodObject<any>,
  SERVICE extends { insert: (data: any) => Promise<ObjectId> },
>(Service: SERVICE, InSchema: IN, OutSchema: OUT) {
  return function InsertControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class InsertController extends SafeParseJsonMixin(Base) {
      public static insert: Handler<{ _id: string }> = async (req) => {
        const { data } = await this.safeParseJson<{ data: z.infer<IN> }>(req);

        const { success } = InSchema.safeParse(data);
        httpInvariant(
          success,
          "Bad data shape.",
          Status.BadRequest,
        );

        const dto: z.infer<IN> = InSchema.parse(data);

        const results = await Service.insert(dto);
        const parsed = OutSchema.parse({ _id: results });

        return new Response(JSON.stringify(parsed));
      };
    };
  };
}
