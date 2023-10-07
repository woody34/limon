import { createHandler, ServeHandlerInfo, Status } from "$fresh/server.ts";
import { UserPaginationDto } from "$modules/user/dtos/user-pagination.dto.ts";
import { UserQueryResultDto } from "$modules/user/dtos/user-query-results.dto.ts";
import { assert } from "https://deno.land/std@0.193.0/_util/asserts.ts";
import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/deps.ts";
import { faker } from "npm:@faker-js/faker";
import manifest from "../../../fresh.gen.ts";
import { UserCreateDto } from "../dtos/user-create.dto.ts";
import { UserInsertResultDto } from "../dtos/user-insert-results.dto.ts";

const hostname = "127.0.0.1";
const baseRoute = `http://${hostname}/user/api`;

const CONN_INFO: ServeHandlerInfo = {
  remoteAddr: { hostname: "127.0.0.1", port: 53496, transport: "tcp" },
};

const data: UserCreateDto = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
};

const headers = {
  accept: "application/json",
  "content-type": "application/json",
};

const handler = await createHandler(manifest, {
  onError: (e) => new Response(JSON.stringify(e)),
});

let id: ObjectId | undefined = undefined;
Deno.test("User Api Endpoint > Insert.", async (ctx) => {
  await ctx.step("should insert document #happy", async () => {
    const req = new Request(`${baseRoute}`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers,
    });

    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.OK);
    const json: UserInsertResultDto = await resp.json();
    assert(ObjectId.isValid(json._id));
    id = json._id;
  });

  await ctx.step("should throw with bad data shape #sad", async () => {
    const req = new Request(`${baseRoute}`, {
      method: "POST",
      headers: { ...headers, "content-length": "0" },
    });

    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.BadRequest);
  });

  await ctx.step("should throw with bad data shape #sad", async () => {
    const body = { data: { firstName: "Ichi", lastName: "Ban" } };
    const req = new Request(`${baseRoute}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...headers,
        "content-length": String(JSON.stringify(body).length),
      },
    });

    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.BadRequest);
  });

  await ctx.step(
    "should throw without accept header #sad",
    async () => {
      const data: UserCreateDto = {
        firstName: "Deno",
        lastName: "Saur",
        email: "denosaur@denoland.com",
      };

      const req = new Request(`${baseRoute}`, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          "content-type": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.NotAcceptable);
    },
  );

  await ctx.step(
    "should throw without content-type header #sad",
    async () => {
      const data: UserCreateDto = {
        firstName: "Deno",
        lastName: "Saur",
        email: "denosaur@denoland.com",
      };

      const req = new Request(`${baseRoute}`, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          "accept": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.UnsupportedMediaType);
    },
  );
});

Deno.test("User Api Endpoint > Update.", async (ctx) => {
  await ctx.step("should update document by id #happy", async () => {
    const orgName = "Deno Org";
    const req = new Request(`${baseRoute}/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          _id: id,
          orgName,
        },
      }),
    });

    const resp = await handler(req, CONN_INFO);
    const data = await resp.json();

    assertEquals(resp.status, Status.OK);
    assertEquals(data.success, true);
  });

  await ctx.step("should throw with bad id #sad", async () => {
    const req = new Request(`${baseRoute}/${id}`, {
      method: "PATCH",
      headers,
    });
    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.BadRequest);
  });

  await ctx.step(
    "should throw without accept header #sad",
    async () => {
      const req = new Request(`${baseRoute}/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.NotAcceptable);
    },
  );

  await ctx.step(
    "should throw without content-type header #sad",
    async () => {
      const req = new Request(`${baseRoute}/${id}`, {
        method: "PATCH",
        headers: {
          "accept": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.UnsupportedMediaType);
    },
  );
});

Deno.test("User Api Endpoint > FindById.", async (ctx) => {
  await ctx.step("should find document by id #happy", async () => {
    const req = new Request(`${baseRoute}/${id}`, {
      headers,
    });

    const resp = await handler(req, CONN_INFO);
    const data = await resp.json();

    assertEquals(resp.status, Status.OK);
    assertEquals(data._id, id);
  });

  await ctx.step("should throw with bad id #sad", async () => {
    const req = new Request(`${baseRoute}/1234123412341234`, {
      headers,
    });

    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.BadRequest);
  });

  await ctx.step(
    "should throw without accept header #sad",
    async () => {
      const req = new Request(`${baseRoute}/${id}`, {
        headers: {
          "content-type": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.NotAcceptable);
    },
  );

  await ctx.step(
    "should throw without content-type header #sad",
    async () => {
      const req = new Request(`${baseRoute}/${id}`, {
        headers: {
          "accept": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.UnsupportedMediaType);
    },
  );
});

Deno.test("User Api Endpoint > Query.", async (ctx) => {
  const pagination: UserPaginationDto = {
    filter: {
      search: data.firstName,
    },
    limit: 1,
    skip: 0,
  };
  await ctx.step("should query documents #happy", async () => {
    const req = new Request(`${baseRoute}/query`, {
      method: "POST",
      body: JSON.stringify({ pagination }),
      headers,
    });

    const resp = await handler(req, CONN_INFO);
    const body: UserQueryResultDto = await resp.json();
    const { count, results: [user] } = body;

    assertEquals(resp.status, Status.OK);
    assertEquals(user._id, id);
    assertEquals(count, 1);
  });

  await ctx.step("should throw with bad pagination #sad", async () => {
    const req = new Request(`${baseRoute}/query`, {
      method: "POST",
      headers,
    });

    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.BadRequest);
  });

  await ctx.step("should throw with bad pagination shape #sad", async () => {
    const pagination: UserPaginationDto = {
      filter: {
        search: 0 as unknown as string, // bad
      },
      limit: 1,
      skip: 0,
    };

    const req = new Request(`${baseRoute}/query`, {
      method: "POST",
      body: JSON.stringify({ pagination }),
      headers,
    });

    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.NotAcceptable);
  });

  await ctx.step(
    "should throw without accept header #sad",
    async () => {
      const req = new Request(`${baseRoute}/query`, {
        method: "POST",
        body: JSON.stringify({ pagination }),
        headers: {
          "content-type": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.NotAcceptable);
    },
  );

  await ctx.step(
    "should throw without content-type header #sad",
    async () => {
      const req = new Request(`${baseRoute}/${id}`, {
        method: "POST",
        body: JSON.stringify({ pagination }),
        headers: {
          "accept": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.UnsupportedMediaType);
    },
  );
});

Deno.test("User Api Endpoint > Archive.", async (ctx) => {
  await ctx.step("should archive document by id #happy", async () => {
    const req = new Request(`${baseRoute}/${id}`, {
      method: "DELETE",
      headers,
    });

    const resp = await handler(req, CONN_INFO);
    const { success } = await resp.json();

    assertEquals(resp.status, Status.OK);
    assertEquals(success, true);
  });

  await ctx.step("should throw with bad id #sad", async () => {
    const req = new Request(`${baseRoute}/1234123412341234`, {
      method: "DELETE",
      headers,
    });

    const resp = await handler(req, CONN_INFO);

    assertEquals(resp.status, Status.BadRequest);
  });

  await ctx.step(
    "should throw without accept header #sad",
    async () => {
      const req = new Request(`${baseRoute}/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.NotAcceptable);
    },
  );

  await ctx.step(
    "should throw without content-type header #sad",
    async () => {
      const req = new Request(`${baseRoute}/${id}`, {
        method: "DELETE",
        headers: {
          "accept": "application/json",
        },
      });

      const resp = await handler(req, CONN_INFO);

      assertEquals(resp.status, Status.UnsupportedMediaType);
    },
  );
});
