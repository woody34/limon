import { MiddlewareHandler } from "$fresh/server.ts";
import { correlationIdMiddleware } from "$modules/shared/middleware/correlation-id.middleware.ts";
import { corsMiddleware } from "$modules/shared/middleware/cors.middleware.ts";

export const handler: MiddlewareHandler[] = [
  corsMiddleware,
  correlationIdMiddleware,
];
