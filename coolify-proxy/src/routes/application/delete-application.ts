import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { safeAsync } from "@utils/safe-async.ts";
import { deleteApplication } from "@coolify/application.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const deleteApplicationRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

deleteApplicationRoute.delete(
  "/delete-application/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { error: deleteApplicationError } = await safeAsync(() =>
      deleteApplication(uuid)
    );
    if (deleteApplicationError) {
      c.status(404);
      return c.json({ message: deleteApplicationError.message });
    }

    c.status(200);
    return c.json({ success: true });
  },
);

export { deleteApplicationRoute };
