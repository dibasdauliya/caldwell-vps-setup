import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { bearerAuth } from "hono/bearer-auth";
import { _truncateDb } from "@sysdb/util.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const _truncateDbRoute = new Hono();

const token = getEnvThrows("PRIV_TOKEN");

_truncateDbRoute.delete(
  "/truncate-db",
  bearerAuth({ token }),
  async (c) => {
    const { error } = await safeAsync(() => _truncateDb());
    if (error) {
      c.status(500);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json({ success: true });
  },
);

export { _truncateDbRoute };
