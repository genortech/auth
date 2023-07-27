// lib/server/email.ts
export const isValidEmail = (maybeEmail: unknown): maybeEmail is string => {
  if (typeof maybeEmail !== "string") return false;
  if (maybeEmail.length > 255) return false;
  const emailRegexp = /^.+@.+$/; // [one or more character]@[one or more character]
  return emailRegexp.test(maybeEmail);
};


export const sendEmailVerificationLink = async (email, token: string) => {
  const url = `http://localhost:5173/email-verification/${token}`;
  console.log(url)
  // await sendEmail(email, {
  //   // ...
  // });
};
