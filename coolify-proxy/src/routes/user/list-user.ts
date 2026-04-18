import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { listUser } from "@sysdb/user/list-user.ts";
import { bearerAuth } from "hono/bearer-auth";
import { getEnvThrows } from "@utils/throws-env.ts";

const listUserRoute = new Hono();

const token = getEnvThrows("PRIV_TOKEN");

listUserRoute.get("/list-user", bearerAuth({ token }), async (c) => {
  const { data: user, error: listUserError } = await safeAsync(
    () => listUser(),
  );
  if (listUserError) {
    c.status(500);
    return c.json({ message: listUserError.message });
  }

  c.status(200);
  return c.json(user);
});

export { listUserRoute };
