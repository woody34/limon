import {
  AuthCreateDto,
  AuthCreateDtoSchema,
} from "$modules/auth/dtos/auth-create.dto.ts";
import { AuthLoginDto } from "$modules/auth/dtos/auth-login.dto.ts";
import { AuthDto, AuthDtoSchema } from "$modules/auth/dtos/auth.dto.ts";
import {
  Auth,
  AuthCollection,
  AuthSchema,
} from "$modules/auth/entities/auth.entity.ts";
import { Roles } from "$modules/shared/constants/roles.enum.ts";
import { MongoIdDtoSchema } from "$modules/shared/dtos/mongo-id.dto.ts";
import { EmailSchema } from "$modules/shared/entities/email.entity.ts";
import { LoggerMixin } from "$modules/shared/mixins/utils/logger.mixin.ts";
import { load } from "$std/dotenv/mod.ts";
import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import {
  create,
  Payload,
  verify,
} from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.3.0/mod.js";
import invariant from "invariant";
import { zxcvbn, zxcvbnOptions } from "npm:@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "npm:@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "npm:@zxcvbn-ts/language-en";
import { mixins } from "../../shared/mixins/utils/mixins.util.ts";

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

const env = await load();
const keyJson = JSON.parse(env["JWT_KEY_JSON"]);
const key = await crypto.subtle.importKey(
  "jwk",
  keyJson,
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export default class AuthService extends mixins(
  LoggerMixin,
) {
  public static passwordStrengthCheck(password: string): boolean {
    const results = zxcvbn(password);
    return results.score > 3;
  }

  public static async encodeJwt<T extends Payload>(
    payload: T,
  ): Promise<string> {
    return await create({ alg: "HS512", typ: "JWT" }, payload, key);
  }

  public static async decodeJwt(jwt: string): Promise<Payload> {
    return await verify(jwt, key);
  }

  public static async generateJwt(id: ObjectId): Promise<string> {
    const { success } = MongoIdDtoSchema.safeParse(id);

    invariant(success, "Unable to generate jwt, invalid auth id.");

    const authId = MongoIdDtoSchema.parse(id);
    const authUser = await AuthCollection.findOne({ _id: authId });

    invariant(authUser != null, "Auth user not found.");

    const payload = {
      id: authUser._id,
      role: authUser.role,
    };

    return await this.encodeJwt(payload);
  }

  public static async hashPassword(password: string): Promise<string> {
    const passwordBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-512", passwordBuffer);
    const hash = new TextDecoder().decode(hashBuffer);
    return hash;
  }

  public static async register(dto: AuthCreateDto): Promise<AuthDto> {
    const { success } = AuthCreateDtoSchema.safeParse(dto);
    invariant(success, "Bad shape.");

    const goodPassword = this.passwordStrengthCheck(dto.password);
    invariant(goodPassword, "Password strength too low.");

    const parsed = AuthCreateDtoSchema.parse(dto);
    const hash = await this.hashPassword(parsed.password);

    const _id = new ObjectId();
    const data = AuthSchema.parse({
      ...parsed,
      _id,
      hash,
      role: Roles.General,
    });

    const resultId = await AuthCollection.insertOne(data);

    invariant(_id.equals(resultId), "Registration issue, ids mismatch.");

    return AuthDtoSchema.parse({ _id: resultId });
  }

  public static async findByEmail(
    email: AuthLoginDto["email"],
  ): Promise<Auth | null> {
    const { success } = EmailSchema.safeParse(email);

    invariant(success, "Bad email");

    const parsedEmail = EmailSchema.parse(email);

    const authUser = await AuthCollection.findOne({ email: parsedEmail });

    const _id = new ObjectId();

    return authUser == null ? null : AuthSchema.parse(authUser);
  }
}

Deno.test("AuthService", async (ctx) => {
  await ctx.step("#passwordStenghCheck", async (ctx) => {
    await ctx.step("Password complexity requirements met", () => {
      const result = AuthService.passwordStrengthCheck(
        "cVsLedwL6yHhz4E9gGFfcX",
      );
      assertEquals(result, true);
    });

    await ctx.step("Password complexity requirements not met", () => {
      const result = AuthService.passwordStrengthCheck("P@$$W0RD!!");
      assertEquals(result, false);
    });
  });
});

// Note to self: They said that the drawback of JWT stored in cookies flagged as HTTPOnly is that you cant read the payload from JS.
// There is a simple solution for this problem. You can split the JWT into 3 parts (header, playload and the signature).
// Then you can set two cookies. The first one flagged as HTTPOnly will contains header + signature and the second one will contains
// only the payload and will not be flagged as HTTPOnly so you can read it from JS. XSS attacker can read or modify the payload,
// but thats ok, because he cannot access the signature, so the modified token will be invalid.
