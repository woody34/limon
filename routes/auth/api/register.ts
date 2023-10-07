import { Handlers } from "$fresh/server.ts";
import AuthController from "$modules/auth/controllers/auth.controller.ts";

export const handler: Handlers = {
  POST: AuthController.register,
};
