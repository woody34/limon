import { LoggerMixin } from "$modules/shared/mixins/utils/logger.mixin.ts";
import {
  ArchiveServiceMixinFactory,
  DeleteMixinFactory,
  FindByIdServiceMixinFactory,
  InsertServiceMixinFactory,
  QueryServiceMixinFactory,
  SoftDeleteMixinFactory,
  UpdateServiceMixinFactory,
} from "../../shared/mixins/service/index.ts";
import { mixins } from "../../shared/mixins/utils/mixins.util.ts";
import { UserCreateDtoSchema } from "../dtos/user-create.dto.ts";
import { UserPaginationDtoSchema } from "../dtos/user-pagination.dto.ts";
import { UserPartialDtoSchema } from "../dtos/user-partial.dto.ts";
import { UserQueryResultDtoSchema } from "../dtos/user-query-results.dto.ts";
import { UserDtoSchema } from "../dtos/user.dto.ts";
import { userQueryFilterFactory } from "../entities/filters/query.filter.ts";
import {
  UserArchivesCollection,
  UserCollection,
  UserSchema,
} from "../entities/user.entity.ts";

const FindByIdMixin = FindByIdServiceMixinFactory(
  UserCollection,
  UserDtoSchema,
);

const QueryMixin = QueryServiceMixinFactory(
  UserCollection,
  UserPaginationDtoSchema,
  UserQueryResultDtoSchema,
  userQueryFilterFactory,
);

const InsertMixin = InsertServiceMixinFactory(
  UserCollection,
  UserCreateDtoSchema,
);

const UpdateMixin = UpdateServiceMixinFactory(
  UserCollection,
  UserPartialDtoSchema,
);

const SoftDeleteMixin = SoftDeleteMixinFactory(UserCollection);
const DeleteMixin = DeleteMixinFactory(UserCollection);
const ArchiveMixin = ArchiveServiceMixinFactory(
  UserCollection,
  UserArchivesCollection,
  UserSchema,
);

export default class UserService extends mixins(
  FindByIdMixin,
  QueryMixin,
  InsertMixin,
  UpdateMixin,
  SoftDeleteMixin,
  DeleteMixin,
  ArchiveMixin,
  LoggerMixin,
) {
}
