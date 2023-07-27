import { auth } from "$lib/server/lucia";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";




export const authHandle: Handle = async ({ event, resolve }) => {
  // we can pass `event` because we used the SvelteKit middleware
  event.locals.auth = auth.handleRequest(event);
  return await resolve(event);
};

export const handle: Handle = sequence(authHandle)
