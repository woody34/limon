import { Handler, Status } from "$fresh/server.ts";
import { SafeParseJsonMixin } from "$modules/shared/mixins/utils/safe-parse-json.mixin.ts";
import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import z, { ZodObject } from "zod";
import { Constructor } from "../constructor.type.ts";

export function QueryControllerMixinFactory<
  IN extends ZodObject<any>,
  OUT extends ZodObject<any>,
  SERVICE extends { query: (data: any) => Promise<z.infer<OUT>> },
>(Service: SERVICE, InSchema: IN, OutSchema: OUT) {
  return function QueryControllerMixin<TBase extends Constructor>(
    Base: TBase,
  ) {
    return class QueryController extends SafeParseJsonMixin(Base) {
      public static query: Handler<z.infer<OUT>> = async (req) => {
        const { pagination } = await this.safeParseJson<
          { pagination: z.infer<IN> }
        >(req);

        httpInvariant(
          pagination != null,
          "Missing pagination.",
          Status.BadRequest,
        );

        const { success } = InSchema.safeParse(pagination);
        httpInvariant(success, "Bad pagination inputs.", Status.NotAcceptable);

        const parsed = InSchema.parse(pagination);

        const results = await Service.query(parsed);

        const sanitized = OutSchema.parse(results);

        return new Response(JSON.stringify(sanitized));
      };
    };
  };
}
