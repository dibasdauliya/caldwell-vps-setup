import { pool } from "../pool.ts";

export async function deleteUser(id: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM users WHERE id = $1`,
      [id],
    );
  } catch (e) {
    throw new Error(`Couldn't delete user : ${e}`);
  } finally {
    client.release();
  }
}
