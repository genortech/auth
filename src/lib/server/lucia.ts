// src/lib/server/lucia.ts
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { pool } from "./db/db";
import { pg } from "@lucia-auth/adapter-postgresql"

export const auth = lucia({
  adapter: pg(pool, {
    user: "auth_user",
    key: "user_key",
    session: "user_session"
  }),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),

  getUserAttributes: (data) => {
    return {
      email: data.email,
      emailVerified: data.email_verified //Boolen if stored as an int
    };
  }
});
export type Auth = typeof auth;
