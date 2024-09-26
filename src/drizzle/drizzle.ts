import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_CONNECTION_STRING as string);

const drizzleClient = drizzle(sql, { schema });

export default drizzleClient;
