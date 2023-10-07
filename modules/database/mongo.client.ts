import { load } from "$std/dotenv/mod.ts";
import { MongoClient } from "mongo";

const { MONGODB_URI } = await load();

if (!MONGODB_URI) {
  console.error(`MONGODB Uri missing. Exiting.`);
  Deno.exit(1);
}

export const client = new MongoClient();
await client.connect(MONGODB_URI);

const database = client.database();

export function disconnect(): void {
  client.close();
}

export default database;
