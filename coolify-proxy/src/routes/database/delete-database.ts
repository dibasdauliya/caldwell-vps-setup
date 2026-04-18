import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteDatabase } from "@coolify/database.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const deleteDatabaseRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

deleteDatabaseRoute.delete(
  "/delete-database/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { error: deleteDatabaseError } = await safeAsync(() =>
      deleteDatabase(uuid)
    );
    if (deleteDatabaseError) {
      c.status(404);
      return c.json({ message: deleteDatabaseError.message });
    }

    c.status(200);
    return c.json({ success: true });
  },
);

export { deleteDatabaseRoute };
