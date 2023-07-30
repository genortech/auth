// routes/email-verification/[token]/+server.ts
import { auth } from "$lib/server/lucia";
import { validateEmailVerificationToken } from "$lib/server/tokens";
import type { RequestHandler } from "./$types";



export const GET = (async ({ token: params, locals }) => {
  console.log("Token Verification")
  const { token } = params;
  try {
    const userId = await validateEmailVerificationToken(token as string);
    console.log("UserId Returned")
    const user = await auth.getUser(userId as string);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateUserAttributes(user.userId, {
      email_verified: true // `Number(true)` if stored as an integer
    });
    console.log("Emailed Verified")
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });
    locals.auth.setSession(session);
    console.log("Session")
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch {
    return new Response("Invalid email verification link", {
      status: 400
    });
  }
}) satisfies RequestHandler;
