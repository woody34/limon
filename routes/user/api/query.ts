import { Handlers } from "$fresh/server.ts";
import { UserController } from "$modules/user/controllers/user.controller.ts";
import { UserQueryResultDto } from "$modules/user/dtos/user-query-results.dto.ts";

export const handler: Handlers<UserQueryResultDto> = {
  POST: UserController.query,
};
