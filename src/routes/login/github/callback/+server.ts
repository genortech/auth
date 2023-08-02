import { auth, githubAuth } from "$lib/server/lucia.js";
import { OAuthRequestError } from "@lucia-auth/oauth";

export const GET = async ({ url, cookies, locals }) => {
  console.log("Callback Verification")
  const storedState = cookies.get("github_oauth_state");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400
    });
  }
  try {

    console.log("Get Github User details")
    const { existingUser, githubUser, createUser } =
      await githubAuth.validateCallback(code);

    console.log("Get Github User details 0")
    const getUser = async () => {
      if (existingUser) return existingUser;

      console.log("Get Github User details 1")
      const user = await createUser({
        attributes: {
          github_username: githubUser.login
        }
      });
      return user;
    };

    console.log("Get Github User details 2")
    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });

    console.log("Get Github User details 3")
    locals.auth.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      console.log('OAuthRequestError ', e)
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
};
