import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { deleteEnv } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";

const deleteEnvRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

deleteEnvRoute.delete(
  "/delete-env/:app_uuid/:env_uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const app_uuid = c.req.param("app_uuid");
    const env_uuid = c.req.param("env_uuid");

    const { data: env, error: deleteEnvError } = await safeAsync(
      () => deleteEnv(app_uuid, env_uuid),
    );
    if (deleteEnvError) {
      c.status(500);
      return c.json({ message: deleteEnvError.message });
    }

    return c.json(env);
  },
);

export { deleteEnvRoute };
