import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

interface Data {
  isAllowed: boolean;
}

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const isAuthenticated = ctx.render({ isAllowed: cookies.auth === "bar" });
    const location = isAuthenticated
      ? `${new URL(req.url).origin}/landing`
      : `${new URL(req.url).origin}/user/login`;
    const headers = new Headers({
      location: location,
    });
    return new Response(null, {
      status: 302,
      headers,
    });
  },
  // GET(req, ctx) {
  //   const cookies = getCookies(req.headers);
  //   return ctx.render!({ isAllowed: cookies.auth === "bar" });
  // },
};

export default function () {
  return <></>;
}
