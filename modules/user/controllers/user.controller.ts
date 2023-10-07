import { Handler } from "$fresh/server.ts";
import { MongoIdDtoSchema } from "$modules/shared/dtos/mongo-id.dto.ts";
import {
  FindByIdControllerMixinFactory,
  InsertControllerMixinFactory,
  QueryControllerMixinFactory,
  UpdateControllerMixinFactory,
} from "$modules/shared/mixins/controller/index.ts";
import { mixins } from "$modules/shared/mixins/utils/mixins.util.ts";
import { SafeParseJsonMixin } from "$modules/shared/mixins/utils/safe-parse-json.mixin.ts";
import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import { UserPartialDtoSchema } from "$modules/user/dtos/user-partial.dto.ts";
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { UserCreateDtoSchema } from "../dtos/user-create.dto.ts";
import { UserInsertResultDtoSchema } from "../dtos/user-insert-results.dto.ts";
import { UserPaginationDtoSchema } from "../dtos/user-pagination.dto.ts";
import { UserQueryResultDtoSchema } from "../dtos/user-query-results.dto.ts";
import { UserDtoSchema } from "../dtos/user.dto.ts";
import UserService from "../services/user.service.ts";

const InsertControllerMixin = InsertControllerMixinFactory(
  UserService,
  UserCreateDtoSchema,
  UserInsertResultDtoSchema,
);

const UpdateControllerMixin = UpdateControllerMixinFactory(
  UserService,
  UserPartialDtoSchema,
);

const FindByIdControllerMixin = FindByIdControllerMixinFactory(
  UserService,
  UserDtoSchema,
);

const QueryControllerMixin = QueryControllerMixinFactory(
  UserService,
  UserPaginationDtoSchema,
  UserQueryResultDtoSchema,
);

export class UserController extends mixins(
  InsertControllerMixin,
  SafeParseJsonMixin,
  UpdateControllerMixin,
  FindByIdControllerMixin,
  QueryControllerMixin,
) {
  public static softDelete: Handler = async (_req, ctx) => {
    const { success: successId } = MongoIdDtoSchema.safeParse(
      ctx.params.id,
    );
    httpInvariant(
      successId,
      `Invalid id: "${ctx.params.id}".`,
      Status.BadRequest,
    );

    const id = MongoIdDtoSchema.parse(ctx.params.id);

    const success = await UserService.softDelete(id);
    return new Response(JSON.stringify({ success }));
  };

  public static delete: Handler = async (_req, ctx) => {
    const { success: successId } = MongoIdDtoSchema.safeParse(
      ctx.params.id,
    );
    httpInvariant(
      successId,
      `Invalid id: "${ctx.params.id}".`,
      Status.BadRequest,
    );

    const id = MongoIdDtoSchema.parse(ctx.params.id);

    const success = await UserService.delete(id);
    return new Response(JSON.stringify({ success }));
  };

  public static archive: Handler = async (_req, ctx) => {
    const { success: successId } = MongoIdDtoSchema.safeParse(
      ctx.params.id,
    );
    httpInvariant(
      successId,
      `Invalid id: "${ctx.params.id}".`,
      Status.BadRequest,
    );

    const id = MongoIdDtoSchema.parse(ctx.params.id);

    const success = await UserService.archive(id);
    return new Response(JSON.stringify({ success }));
  };
}
