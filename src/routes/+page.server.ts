// routes/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";

import type { PageServerLoad, Actions } from "./$types";
import { auth } from "$lib/server/lucia";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) throw redirect(302, "/login");
  return {
    userId: session.user.userId,
    email: session.user.email
  };
};

export const actions: Actions = {
  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) return fail(401);
    await auth.invalidateSession(session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    throw redirect(302, "/login"); // redirect to login page
  }
};
