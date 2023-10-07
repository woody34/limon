import { Handler } from "https://deno.land/std@0.193.0/http/server.ts";

export interface AuthApi {
  login: Handler;
  logout: Handler;
}
