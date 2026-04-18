import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { createApplication, startApplication } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { ZApplication } from "@coolify/types.ts";

const createApplicationRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createApplicationRoute.post(
  "/create-application",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const { data: body, error: jsonError } = await safeAsync(() =>
      c.req.json()
    );
    if (jsonError) {
      c.status(400);
      return c.json({ message: jsonError.message });
    }

    const parsed = ZApplication.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: application, error: createApplicationError } =
      await safeAsync(
        () => createApplication(parsed.data),
      );

    if (createApplicationError) {
      c.status(500);
      return c.json({ message: createApplicationError.message });
    }

    // Auto-start the application after creation so it deploys immediately
    if (application?.uuid) {
      const { error: startError } = await safeAsync(() =>
        startApplication(application.uuid)
      );
      if (startError) {
        console.error("Auto-start failed:", startError.message);
        // Still return the created application — user can start manually
      }
    }

    return c.json(application);
  },
);

export { createApplicationRoute };
