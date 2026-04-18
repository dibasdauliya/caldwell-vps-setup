import { pool } from "../pool.ts";
import { Project } from "../types.ts";

export async function listProject(): Promise<Project[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM projects`,
    );
    return result.rows as Project[];
  } catch (e) {
    throw new Error(`Couldn't list project : ${e}`);
  } finally {
    client.release();
  }
}

export async function listProjectByUser(user_id: string): Promise<Project[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM projects WHERE user_id = $1`,
      [user_id],
    );
    return result.rows as Project[];
  } catch (e) {
    throw new Error(`Couldn't list project : ${e}`);
  } finally {
    client.release();
  }
}
