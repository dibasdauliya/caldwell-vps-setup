import { Resend } from "resend";
import { getEnvThrows } from "@utils/throws-env.ts";

const RESEND_API_KEY = getEnvThrows("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

const signinEmail = (signinUrl: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sign In Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f6fa; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px;">
          <tr>
            <td align="center" style="font-size: 24px; font-weight: bold; padding-bottom: 20px;">
              Welcome Back!
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 16px; padding-bottom: 30px;">
              Click the button below to sign in to your account.
            </td>
          </tr>
          <tr>
            <td align="center">
              <!-- Sign In Button -->
              <a href="${signinUrl}"
                 style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Sign In
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 12px; color: #888888; padding-top: 30px;">
              If you didn’t request this email, you can safely ignore it.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const sendSigninEmail = async (email: string, token: string) => {
  const FRONTEND_URL = getEnvThrows("FRONTEND_URL");
  const signinUrl = `${FRONTEND_URL}/signin/?token=${token}`;
  const { error } = await resend.emails.send({
    from: "no-reply@cstem.us",
    to: [email],
    subject: "Sign In Request",
    html: signinEmail(signinUrl),
  });

  if (error) {
    throw new Error(`Couldn't send login email: ${error.message}`);
  }
};
