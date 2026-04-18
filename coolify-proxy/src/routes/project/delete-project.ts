import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { deleteProject as deleteProjectEntry } from "@sysdb/project/delete-project.ts";
import { deleteProject as deleteProjectCoolify } from "@coolify/project.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
const deleteProjectRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

deleteProjectRoute.get(
  "/delete-project/:uuid",
  jwt({
    secret: JWT_SECRET,
    cookie: "auth-token",
  }),
  async (c) => {
    const uuid = c.req.param("uuid");

    const { error: deleteProjectCoolifyError } = await safeAsync(() =>
      deleteProjectCoolify(uuid)
    );
    if (deleteProjectCoolifyError) {
      c.status(404);
      return c.json({ message: deleteProjectCoolifyError.message });
    }

    const { error } = await safeAsync(() => deleteProjectEntry(uuid));
    if (error) {
      c.status(404);
      return c.json({ message: error.message });
    }

    c.status(200);
    return c.json({ success: true });
  },
);

export { deleteProjectRoute };
