import z from "zod";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { getUserByEmail } from "@sysdb/user/get-user.ts";
import { sendSigninEmail } from "../../email/send-email.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { setCookie } from "hono/cookie";

const signinUserRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");
const FRONTEND_URL = getEnvThrows("FRONTEND_URL");

const ZsigninUser = z.object({
  email: z.email(),
});

signinUserRoute.get("/signin-user/:token", async (c) => {
  const token = c.req.param("token");

  console.log("[signin-user GET] full URL:", c.req.url);
  console.log("[signin-user GET] token param:", token);
  console.log("[signin-user GET] token length:", token.length);
  console.log("[signin-user GET] dot count:", token.split(".").length - 1);
  console.log("[signin-user GET] JWT_SECRET length:", JWT_SECRET.length);
  console.log("[signin-user GET] FRONTEND_URL:", FRONTEND_URL);

  const { error: jwtVerifyError } = await safeAsync(() =>
    verify(token, JWT_SECRET),
  );

  if (jwtVerifyError) {
    console.log("[signin-user GET] JWT verify FAILED:", jwtVerifyError.message);
    return c.redirect(`${FRONTEND_URL}/login?error=invalid_token`);
  }

  console.log("[signin-user GET] JWT verify SUCCESS, redirecting to frontend");
  return c.redirect(`${FRONTEND_URL}/api/auth/verify?token=${token}`);
});

signinUserRoute.post("/signin-user", async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(400);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZsigninUser.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ message: z.prettifyError(parsed.error) });
  }

  const { data: user, error: getUserError } = await safeAsync(() =>
    getUserByEmail(parsed.data.email),
  );
  if (getUserError) {
    c.status(401);
    return c.json({ message: getUserError });
  }
  if (!user) {
    c.status(401);
    return c.json({ message: "Unauthorized." });
  }

  const token = await sign(
    {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 60,
    },
    JWT_SECRET,
  );

  // TODO: Re-enable email sending once DNS propagates
  // const { error: sendEmailError } = await safeAsync(() =>
  //   sendSigninEmail(parsed.data.email, token)
  // );
  // if (sendEmailError) {
  //   c.status(500);
  //   return c.json({ message: sendEmailError.message });
  // }

  c.status(200);
  return c.json({ message: "Email sent.", token });
});

export { signinUserRoute };
