import { Handler } from "https://deno.land/std@0.193.0/http/server.ts";

export interface CrudApi {
  find: Handler;
  findById: Handler;
  create: Handler;
  update: Handler;
  delete: Handler;
}
