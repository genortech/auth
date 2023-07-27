import { generateRandomString, isWithinExpiration } from "lucia/utils";
import { dbPool } from "./db/db";
import { eq } from "drizzle-orm";
import { userEmailVerificationTable } from "./db/schema/users";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
  const storedUserTokens = await dbPool.select().from(userEmailVerificationTable).where(eq(userEmailVerificationTable.userId, userId))
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 1 hour
      // and reuse the token if true
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(63);
  await dbPool.insert(userEmailVerificationTable).values({ userId: userId, id: token, expires: new Date().getTime() + EXPIRES_IN })

  return token;
};

export const validateEmailVerificationToken = async (token: string) => {
  const storedToken = await dbPool.transaction(async (trx) => {
    const storedToken = await trx.select().from(userEmailVerificationTable).where(eq(userEmailVerificationTable.id, token))
    console.log("StoredToken", storedToken)
    if (!storedToken) throw new Error("Invalid token");
    await tx.delete(userEmailVerificationTable).where(eq(userEmailVerificationTable.id, storedToken.id))
    return storedToken;
  });
  const tokenExpires = Number(storedToken.expires); // bigint => number conversion
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error("Expired token");
  }
  return storedToken.userId;
};
