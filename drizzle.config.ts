//drizzle.config.ts
import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/lib/server/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  sslmode: 'require',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  }
} satisfies Config;
