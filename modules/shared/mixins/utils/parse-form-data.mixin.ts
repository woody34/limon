import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { ZodObject } from "https://deno.land/x/zod@v3.22.2/types.ts";
import z from "zod";
import { Constructor } from "../constructor.type.ts";

export function ParseFormDataMixin<TBase extends Constructor>(Base: TBase) {
  return class ParseFormData extends Base {
    public static async parseFormData<S extends ZodObject<any>>(
      req: Request,
      schema: S,
    ): Promise<{ data: z.infer<S> }> {
      let body: null | { [k: string]: FormDataEntryValue } = null;
      try {
        const formData = await req.formData();
        body = Object.fromEntries(formData);
      } catch {
        httpInvariant(false, "Malformed body.", Status.BadRequest);
      }

      httpInvariant(
        body != null,
        "Body must not be null.",
        Status.BadRequest,
      );

      const { success } = schema.safeParse(body);

      httpInvariant(success, "Bad form data.", Status.BadRequest);

      const data = schema.parse(body);

      return { data };
    }
  };
}
