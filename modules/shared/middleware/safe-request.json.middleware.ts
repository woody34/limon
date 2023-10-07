import { MiddlewareHandlerContext, Status } from "$fresh/server.ts";
import { magicError } from "https://deno.land/x/cstack@0.1.0/mod.ts";
import { httpInvariant } from "../utils/http-invariant.util.ts";

export async function secureRequestJson(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  try {
    const contentType = req.headers.get("content-type");
    httpInvariant(
      contentType === "application/json",
      "Endpoint requires 'Content-Type' header to be application/json, only accepts json.",
      Status.UnsupportedMediaType,
    );

    const accept = req.headers.get("accept");
    httpInvariant(
      accept?.includes("application/json") === true,
      "Endpoint requires 'Accept' header to be application/json, only returns json.",
      Status.NotAcceptable,
    );

    return await ctx.next();
  } catch (error) {
    magicError(error);
    return new Response(
      JSON.stringify({
        timestamp: new Date(),
        status: error?.code,
        error: error?.name,
        message: error?.message,
        path: req.url,
        corelationId: ctx.state.correlationId,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: error?.code ?? 500,
      },
    );
  }
}
