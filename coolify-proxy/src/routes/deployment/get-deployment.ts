import { Hono } from "hono";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { getDeployment } from "@coolify/deployment.ts";
import { jwt } from "hono/jwt";

const getDeploymentRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

getDeploymentRoute.get(
  "/get-deployment/:app_uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const app_uuid = c.req.param("app_uuid");
    const { data, error } = await safeAsync(() => getDeployment(app_uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }
    c.status(200);
    return c.json(data);
  },
);

export { getDeploymentRoute };
