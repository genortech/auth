// routes/email-verification/[token]/+server.ts
import { auth } from "$lib/server/lucia";
import { validateEmailVerificationToken } from "$lib/server/tokens";
import { fail } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const GET: RequestHandler = async ({ params, locals }) => {
  const { token } = params;
  try {
    const userId = await validateEmailVerificationToken(token);
    const user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateUserAttributes(user.userId, {
      email_verified: true // `Number(true)` if stored as an integer
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });
    locals.auth.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch {
    return fail(400, {
      message: "Invalid email verification link"
    });
  }
};