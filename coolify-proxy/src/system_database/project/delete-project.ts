import { pool } from "../pool.ts";

export async function deleteProject(
  id: string,
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM projects WHERE id = $1`,
      [id],
    );
  } catch (e) {
    throw new Error(`Couldn't delete project : ${e}`);
  } finally {
    client.release();
  }
}
