import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { updateApplication } from "@coolify/application.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { ZApplication } from "@coolify/types.ts";

const updateApplicationRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

updateApplicationRoute.post(
  "/update-application/:app_uuid",
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

    const parsed = ZApplication.partial().safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: application, error: updateApplicationError } =
      await safeAsync(
        () => updateApplication(app_uuid, parsed.data),
      );
    if (updateApplicationError) {
      c.status(500);
      return c.json({ message: updateApplicationError.message });
    }

    return c.json(application);
  },
);

export { updateApplicationRoute };
