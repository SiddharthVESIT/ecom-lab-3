import pg from 'pg';

const { Pool } = pg;

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
});

export async function query(text, params = []) {
  return dbPool.query(text, params);
}
