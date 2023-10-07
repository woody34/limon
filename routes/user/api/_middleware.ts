import { MiddlewareHandler } from "$fresh/server.ts";
import { secureRequestJson } from "$modules/shared/middleware/safe-request.json.middleware.ts";
import { secureResponseJson } from "$modules/shared/middleware/safe-response-json.middleware.ts";

export const handler: MiddlewareHandler[] = [
  secureRequestJson,
  secureResponseJson,
];
