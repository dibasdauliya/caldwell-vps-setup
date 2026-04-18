import { pool } from "../pool.ts";
import { User } from "../types.ts";

export async function listUser(): Promise<User[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM users`,
    );
    return result.rows as User[];
  } catch (e) {
    throw new Error(`Couldn't list user : ${e}`);
  } finally {
    client.release();
  }
}
