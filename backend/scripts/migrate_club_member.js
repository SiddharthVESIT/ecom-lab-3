import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
});

async function migrate() {
  const client = await pool.connect();
  try {
    const checkCol = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='is_club_member'
    `);
    
    if (checkCol.rows.length === 0) {
      console.log('Adding is_club_member...');
      await client.query('ALTER TABLE users ADD COLUMN is_club_member BOOLEAN DEFAULT false;');
      console.log('Added!');
    } else {
      console.log('Exists.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
