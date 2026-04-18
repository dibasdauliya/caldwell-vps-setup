import { pool } from "../pool.ts";
import { Project } from "../types.ts";

export async function createProject(
  id: string,
  name: string,
  user_id: string,
): Promise<Project> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO projects (id, name, user_id )
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, name, user_id],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't create project : ${e}`);
  } finally {
    client.release();
  }
}
