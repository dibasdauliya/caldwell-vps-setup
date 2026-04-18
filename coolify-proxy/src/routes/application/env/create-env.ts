import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { createEnv } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { ZEnvironmentVariable } from "@coolify/types.ts";

const createEnvRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createEnvRoute.post(
  "/create-env/:uuid",
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

    const { data: env, error: createEnvError } = await safeAsync(
      () => createEnv(uuid, parsed.data),
    );
    if (createEnvError) {
      c.status(500);
      return c.json({ message: createEnvError.message });
    }

    return c.json(env);
  },
);

const ZEnvironmentVariableBulk = z.array(ZEnvironmentVariable);

createEnvRoute.post(
  "/create-env-bulk/:app_uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const app_uuid = c.req.param("app_uuid");
    const { data: body, error: jsonError } = await safeAsync(() =>
      c.req.json()
    );
    if (jsonError) {
      c.status(400);
      return c.json({ message: jsonError.message });
    }

    const parsed = ZEnvironmentVariableBulk.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const envs = [];
    for (const env of parsed.data) {
      const { data, error: createEnvError } = await safeAsync(
        () => createEnv(app_uuid, env),
      );
      if (createEnvError) {
        c.status(500);
        return c.json({ message: createEnvError.message });
      }
      envs.push(data);
    }

    return c.json(envs);
  },
);

export { createEnvRoute };
