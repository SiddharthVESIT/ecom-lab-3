import { query } from '../../config/db.js';

export async function createUser({ fullName, email, passwordHash }) {
  const sql = `
    INSERT INTO users (full_name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, full_name, email, role, flavor_profile, created_at
  `;
  const { rows } = await query(sql, [fullName, email, passwordHash]);
  return rows[0];
}

export async function findUserByEmail(email) {
  const { rows } = await query(
    'SELECT id, full_name, email, password_hash, role, flavor_profile FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await query(
    'SELECT id, full_name, email, role, flavor_profile FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
}
