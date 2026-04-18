import { pool } from "../pool.ts";
import { User } from "../types.ts";

export async function createUser(
  email: string,
): Promise<User> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO users (email)
       VALUES ($1)
       RETURNING *`,
      [email],
    );
    return result.rows[0];
  } catch (e) {
    throw new Error(`Couldn't create user : ${e}`);
  } finally {
    client.release();
  }
}

export async function createUserBulk(
  emails: string[],
): Promise<User[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO users (email)
       SELECT UNNEST($1::text[])
       RETURNING *`,
      [emails],
    );
    return result.rows;
  } catch (e) {
    throw new Error(`Couldn't create users : ${e}`);
  } finally {
    client.release();
  }
}
