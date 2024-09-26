import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/out",
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION_STRING as string,
  },
  verbose: true,
  strict: true,
});
