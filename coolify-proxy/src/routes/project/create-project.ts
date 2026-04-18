import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import {
  createProject as createProjectCoolify,
  deleteProject,
} from "@coolify/project.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { User } from "@sysdb/types.ts";
import { createProject as createProjectEntry } from "@sysdb/project/create-project.ts";

const createProjectRoute = new Hono();

const ZcreateProject = z.object({
  name: z.string(),
});

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createProjectRoute.post(
  "/create-project",
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

    const parsed = ZcreateProject.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: projectCoolify, error: createProjectErrorCoolify } =
      await safeAsync(
        () => createProjectCoolify(parsed.data.name),
      );
    if (createProjectErrorCoolify) {
      c.status(500);
      return c.json({ message: createProjectErrorCoolify });
    }

    // @ts-expect-error : <>
    const payload = c.get("jwtPayload") as unknown as User;
    const { data: projectEntry, error: createProjectErrorEntry } =
      await safeAsync(
        () =>
          createProjectEntry(
            projectCoolify.uuid,
            parsed.data.name,
            payload.id,
          ),
      );

    if (createProjectErrorEntry) {
      const { error: deleteProjectError } = await safeAsync(
        () => deleteProject(projectCoolify.uuid),
      );
      if (deleteProjectError) {
        c.status(500);
        return c.json({
          message: deleteProjectError,
          _info: `Contact Admin. Dangiling project - ${projectCoolify.uuid}`,
        });
      }
      c.status(500);
      return c.json({ message: createProjectErrorEntry });
    }

    c.status(201);
    return c.json(projectEntry);
  },
);

export { createProjectRoute };
