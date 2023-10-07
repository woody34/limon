import { MiddlewareHandlerContext } from "$fresh/server.ts";

export async function corsMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  if (req.method == "OPTIONS") {
    const resp = new Response(null, {
      status: 204,
    });
    const origin = req.headers.get("Origin") || "*";
    const headers = resp.headers;
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "DELETE");
    return resp;
  }

  const origin = req.headers.get("Origin") || "*";
  const resp = await ctx.next();
  const headers = resp.headers;

  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With",
  );
  headers.set(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS, GET, PATCH, PUT, DELETE",
  );

  return resp;
}
