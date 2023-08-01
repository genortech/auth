// routes/+page.server.ts
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) throw redirect(302, "/login");
  if (!session.user.emailVerified) {
    throw redirect(302, "/email-verification");
  }
  return {
    userId: session.user.userId,
    email: session.user.email,
    githubUsername: session.user.githubUsername
  };
};

export const actions: Actions = {
  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(302, "/login");
    if (!session.user.emailVerified) {
      throw redirect(302, "/email-verification");
    }
    await auth.invalidateSession(session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    throw redirect(302, "/login"); // redirect to login page
  }
};
