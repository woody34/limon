import { Handlers } from "$fresh/server.ts";
import { UserController } from "$modules/user/controllers/user.controller.ts";

export const handler: Handlers = {
  POST: UserController.insert,
};
