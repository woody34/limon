import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { magicError } from "https://deno.land/x/cstack@0.1.0/mod.ts";

export async function secureResponseJson(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  try {
    const resp = await ctx.next();
    resp.headers.append("content-type", "application/json");
    resp.headers.append("content-security-policy", "frame-ancestors 'none'");
    resp.headers.append(
      "strict-transport-security",
      "max-age=63072000; includeSubDomains; preload",
    );
    resp.headers.append(
      "x-content-type-options",
      "nosniff",
    );
    resp.headers.append(
      "x-frame-options",
      "DENY",
    );

    return resp;
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
