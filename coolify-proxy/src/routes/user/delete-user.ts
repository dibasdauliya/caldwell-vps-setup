import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteUser } from "@sysdb/user/delete-user.ts";
import { bearerAuth } from "hono/bearer-auth";
import { getEnvThrows } from "@utils/throws-env.ts";

const deleteUserRoute = new Hono();

const token = getEnvThrows("PRIV_TOKEN");

deleteUserRoute.delete(
  "/delete-user/:id",
  bearerAuth({ token }),
  async (c) => {
    const id = c.req.param("id");
    const { error } = await safeAsync(() => deleteUser(id));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json({ success: true });
  },
);

export { deleteUserRoute };
