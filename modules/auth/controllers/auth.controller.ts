import { Handler } from "$fresh/server.ts";
import { AuthCreateDtoSchema } from "$modules/auth/dtos/auth-create.dto.ts";
import { AuthLoginDtoSchema } from "$modules/auth/dtos/auth-login.dto.ts";
import AuthService from "$modules/auth/services/auth.service.ts";
import { LoggerMixin } from "$modules/shared/mixins/utils/logger.mixin.ts";
import { mixins } from "$modules/shared/mixins/utils/mixins.util.ts";
import { ParseFormDataMixin } from "$modules/shared/mixins/utils/parse-form-data.mixin.ts";
import { SafeParseJsonMixin } from "$modules/shared/mixins/utils/safe-parse-json.mixin.ts";
import { httpInvariant } from "$modules/shared/utils/http-invariant.util.ts";
import { UserCreateDtoSchema } from "$modules/user/dtos/user-create.dto.ts";
import UserService from "$modules/user/services/user.service.ts";
import { setCookie } from "$std/http/cookie.ts";
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";

export default class AuthController extends mixins(
  LoggerMixin,
  SafeParseJsonMixin,
  ParseFormDataMixin,
) {
  private static setAuthCookieRedirect = (
    req: Request,
    jwt: string,
    location: string,
  ): Response => {
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: jwt,
      maxAge: 60 * 15, // 15 min
      sameSite: "Lax",
      domain: new URL(req.url).hostname,
      path: "/",
      secure: true,
      httpOnly: true,
    });
    headers.set("location", location);

    return new Response(null, {
      status: 303,
      headers,
    });
  };

  public static register: Handler = async (req) => {
    const { data } = await this.parseFormData(req, AuthCreateDtoSchema);

    const { _id } = await AuthService.register(data);

    const userData = UserCreateDtoSchema.parse({
      _id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

    const userId = await UserService.insert(userData);
    const jwt = await AuthService.generateJwt(userId);

    return this.setAuthCookieRedirect(req, jwt, "/");
  };

  public static login: Handler = async (req) => {
    const { data } = await this.parseFormData(req, AuthLoginDtoSchema);

    const authUser = await AuthService.findByEmail(data.email);
    httpInvariant(authUser != null, "Invalid email.", Status.Unauthorized);

    const hashedPassword = await AuthService.hashPassword(data.password);
    httpInvariant(
      authUser.hash === hashedPassword,
      "Invalid password.",
      Status.Unauthorized,
    );

    const jwt = await AuthService.generateJwt(authUser._id);

    return this.setAuthCookieRedirect(req, jwt, "/");
  };
}
