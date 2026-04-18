import { pool } from "./pool.ts";

export const _truncateDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      `
        SET session_replication_role = replica;

        TRUNCATE TABLE
          databases,
          applications,
          projects,
          users

        RESTART IDENTITY CASCADE;

        SET session_replication_role = DEFAULT;
`,
    );
    return true;
  } catch (e) {
    throw new Error(`Couldn't _truncate db : ${e}`);
  } finally {
    client.release();
  }
};
