// routes/login/+page.server.ts
import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";
import { isValidEmail } from "$lib/email";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, "/");
  return {};
};


export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    console.log("Login Form", formData)
    const email = formData.get("email");
    const password = formData.get("password");

    // basic check
    if (!isValidEmail(email)) {
      return new Response("Invalid email", {
        status: 400
      });
    }
    console.log("Email is valid")
    if (
      typeof password !== "string" ||
      password.length < 1 ||
      password.length > 255
    ) {
      return fail(400, {
        message: "Invalid password"
      });
    }
    console.log("Password is valid")
    try {
      // find user by key
      // and validate password
      console.log("Loggining in user")
      const user = await auth.useKey(
        "email",
        email.toLowerCase(),
        password
      );

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {
        }
      });
      console.log("Session Active", session)
      locals.auth.setSession(session); // set session cookie
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        // user does not exist
        // or invalid password
        return fail(400, {
          message: "Incorrect username of password"
        });
      }
      return fail(500, {
        message: "An unknown error occurred"
      });
    }
    // redirect to
    // make sure you don't throw inside a try/catch block!
    throw redirect(302, "/");
  }
};
