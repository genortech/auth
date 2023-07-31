// routes/password-reset/+page.server.ts
import { auth } from "$lib/server/lucia";
import { fail } from "@sveltejs/kit";
import { generatePasswordResetToken } from "$lib/server/tokens";

import type { Actions } from "./$types";
import { usersTable } from "$lib/server/db/schema/users";
import { dbPool } from "$lib/server/db/db";
import { isValidEmail, sendPasswordResetLink } from "$lib/server/email";
import { eq } from "drizzle-orm";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    // basic check
    if (!isValidEmail(email)) {
      return fail(400, {
        message: "Invalid email"
      });
    }
    try {
      const [storedUser] = await dbPool
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .limit(1)
      if (!storedUser) {
        return fail(400, {
          message: "User does not exist"
        });
      }
      const user = auth.transformDatabaseUser(storedUser);
      const token = await generatePasswordResetToken(user.userId);
      await sendPasswordResetLink(email, token);
      return {
        success: true
      };
    } catch (e) {
      return fail(500, {
        message: "An unknown error occurred"
      });
    }
  }
};
