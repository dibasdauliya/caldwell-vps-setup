import z from "zod";
import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { createUser, createUserBulk } from "@sysdb/user/create-user.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { bearerAuth } from "hono/bearer-auth";

const createUserRoute = new Hono();

const ZcreateUser = z.object({
  email: z.email(),
});

const token = getEnvThrows("PRIV_TOKEN");

createUserRoute.post("/create-user", bearerAuth({ token }), async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(400);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZcreateUser.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ message: z.prettifyError(parsed.error) });
  }

  const { data: user, error: createUserError } = await safeAsync(
    () => createUser(parsed.data.email),
  );
  if (createUserError) {
    c.status(500);
    return c.json({ message: createUserError.message });
  }

  c.status(201);
  return c.json(user);
});

const ZcreateUserBulk = z.object({
  emails: z.array(z.email()),
});

createUserRoute.post("/create-user-bulk", bearerAuth({ token }), async (c) => {
  const { data: body, error: jsonError } = await safeAsync(() => c.req.json());
  if (jsonError) {
    c.status(400);
    return c.json({ message: jsonError.message });
  }

  const parsed = ZcreateUserBulk.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ message: z.prettifyError(parsed.error) });
  }

  const { data: users, error: createUserError } = await safeAsync(
    () => createUserBulk(parsed.data.emails),
  );
  if (createUserError) {
    c.status(500);
    return c.json({ message: createUserError.message });
  }

  c.status(201);
  return c.json(users);
});

export { createUserRoute };
