// routes/signup/+page.server.ts
import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";
import { LuciaError } from "lucia";
import { isValidEmail } from "$lib/server/email";
import { generateEmailVerificationToken } from "$lib/server/tokens";
import { sendEmailVerificationLink } from "$lib/server/email";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) {
    if (!session.user.emailVerified) throw redirect(302, "/email-verification");
    throw redirect(302, "/")
  };
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    console.log("Signup Form", formData)
    const email = formData.get("email");
    const password = formData.get("password");
    // basic check
    if (!isValidEmail(email)) {
      return fail(400, { message: "Invalid email" }
      );
    }
    console.log("Email is valid")
    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 255
    ) {
      return fail(400, {
        message: "Invalid password"
      });
    }
    console.log("Password is valid")
    try {
      console.log("Creating User")
      const user = await auth.createUser({
        key: {
          providerId: "email", // auth method
          providerUserId: email.toLowerCase(), // unique id when using "username" auth method
          password // hashed by Lucia
        },
        attributes: {
          email: email.toLowerCase(),
          email_verified: false,
        }

      });
      console.log("User Details", user)
      console.log("Creating Session")
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {
        }
      });
      console.log('User Session', session)
      locals.auth.setSession(session); // set session cookie
      const token = await generateEmailVerificationToken(user.userId);
      await sendEmailVerificationLink(email, token);
      console.log("User Token", token)
    } catch (e) {
      console.log("Error Signup", e)
      // this part depends on the database you're using
      // check for unique constraint error in user table
      if (e instanceof LuciaError &&
        e.message === "AUTH_INVALID_USER_ID"
      ) {
        return fail(400, {
          message: "Username/Account already taken"
        });
      }
      return fail(500, {
        message: "An unknown error occurred"
      });
    }
    // redirect to
    // make sure you don't throw inside a try/catch block!
    throw redirect(302, "/email-verification");
  }
};
