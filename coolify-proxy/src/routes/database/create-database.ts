import z from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import {
  createDatabaseMongoDB,
  createDatabasePostgreSQL,
  createDatabaseRedis,
} from "@coolify/database.ts";
import { safeAsync } from "@utils/safe-async.ts";
import { getEnvThrows } from "@utils/throws-env.ts";
import { ZMongo, ZPostgreSQL, ZRedis } from "@coolify/types.ts";

const createDatabaseRoute = new Hono();

const JWT_SECRET = getEnvThrows("JWT_SECRET");

createDatabaseRoute.post(
  "/create-database-mongodb",
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

    const parsed = ZMongo.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: database, error: createDatabaseErrorCoolify } =
      await safeAsync(
        () => createDatabaseMongoDB(parsed.data),
      );
    if (createDatabaseErrorCoolify) {
      c.status(500);
      return c.json({ message: createDatabaseErrorCoolify.message });
    }

    return c.json(database);
  },
);

createDatabaseRoute.post(
  "/create-database-postgresql",
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

    const parsed = ZPostgreSQL.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: database, error: createDatabaseErrorCoolify } =
      await safeAsync(
        () => createDatabasePostgreSQL(parsed.data),
      );

    if (createDatabaseErrorCoolify) {
      c.status(500);
      return c.json({ message: createDatabaseErrorCoolify.message });
    }

    return c.json(database);
  },
);

createDatabaseRoute.post(
  "/create-database-redis",
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

    const parsed = ZRedis.safeParse(body);
    if (!parsed.success) {
      c.status(400);
      return c.json({ message: z.prettifyError(parsed.error) });
    }

    const { data: database, error: createDatabaseErrorCoolify } =
      await safeAsync(
        () => createDatabaseRedis(parsed.data),
      );

    if (createDatabaseErrorCoolify) {
      c.status(500);
      return c.json({ message: createDatabaseErrorCoolify.message });
    }

    return c.json(database);
  },
);

export { createDatabaseRoute };
