import { MiddlewareHandlerContext } from "$fresh/server.ts";

export function correlationIdMiddleware(
  _req: Request,
  ctx: MiddlewareHandlerContext,
) {
  ctx.state.correlationId = crypto.randomUUID();
  return ctx.next();
}
