// routes/email-verification/[token]/+server.ts
import { auth } from "$lib/server/lucia";
import { validateEmailVerificationToken } from "$lib/server/tokens";
import type { RequestHandler } from "@sveltejs/kit";



export const GET = (async ({ params, locals }) => {
  console.log("Token Verification")
  const { token } = params;
  console.log("Token", token)
  try {
    const userId = await validateEmailVerificationToken(token);
    console.log("UserId Returned")
    const user = await auth.getUser(userId);
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
    console.log("Session Created")
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
