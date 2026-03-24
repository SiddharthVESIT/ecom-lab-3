import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Add flavor_profile column if it doesn't exist
    const checkCol = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='flavor_profile'
    `);
    
    if (checkCol.rows.length === 0) {
      console.log('Adding flavor_profile column to users table...');
      await client.query('ALTER TABLE users ADD COLUMN flavor_profile VARCHAR(50);');
    } else {
      console.log('flavor_profile column already exists.');
    }

    // 2. Insert admin user
    const adminEmail = 'admin@zen.com';
    const checkAdmin = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (checkAdmin.rows.length === 0) {
      console.log('Inserting default admin user...');
      const passwordHash = await bcrypt.hash('admin123', 12);
      await client.query(`
        INSERT INTO users (full_name, email, password_hash, role) 
        VALUES ('Admin', $1, $2, 'admin')
      `, [adminEmail, passwordHash]);
      console.log('Admin user created: admin@zen.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
