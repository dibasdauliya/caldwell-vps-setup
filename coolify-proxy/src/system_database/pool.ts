import pg from "pg";
import { getEnvThrows } from "@utils/throws-env.ts";
const { Pool } = pg;

const DATABASE_URL = getEnvThrows("DATABASE_URL");

const pool = new Pool({ connectionString: DATABASE_URL });

const migration = await Deno.readTextFile(
  new URL("./migrations.sql", import.meta.url).pathname,
);

await pool.query(migration);

export { pool };
