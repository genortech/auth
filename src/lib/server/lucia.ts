// src/lib/server/lucia.ts
import { dev } from "$app/environment";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } from "$env/static/private";
import { pg } from "@lucia-auth/adapter-postgresql";
import { github, google } from '@lucia-auth/oauth/providers';
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { pool } from "./db/db";

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
      emailVerified: data.email_verified, //Boolen if stored as an int
      githubUsername: data.github_username
    };
  }
});



export const githubAuth = github(auth, {
  clientId: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET
});

export const googleAuth = google(auth, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_REDIRECT_URL,
})

export type Auth = typeof auth;
