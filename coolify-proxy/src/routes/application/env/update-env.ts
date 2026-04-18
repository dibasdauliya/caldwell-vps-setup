import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { updateEnv } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { ZEnvironmentVariable } from "@coolify/types.ts";

const updateEnvRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

updateEnvRoute.patch(
  "/update-env/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");
    const { data: body, error: jsonError } = await safeAsync(() =>
      c.req.json()
    );
    if (jsonError) {
      c.status(400);
      return c.json({ message: jsonError.message });
    }

    const parsed = ZEnvironmentVariable.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: env, error: updateEnvError } = await safeAsync(
      () => updateEnv(uuid, parsed.data),
    );
    if (updateEnvError) {
      c.status(500);
      return c.json({ message: updateEnvError.message });
    }

    return c.json(env);
  },
);

export { updateEnvRoute };
