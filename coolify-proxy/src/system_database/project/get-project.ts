import { pool } from "../pool.ts";
import { Project } from "../types.ts";

export async function getProject(id: string): Promise<Project> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM projects WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't get project : ${e}`);
  } finally {
    client.release();
  }
}
